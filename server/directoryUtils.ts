/**
 * Agent Llama - Modern chat interface for Claude Agent SDK
 * Copyright (C) 2025 Safastak
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Get the default working directory for agent operations
 * Cross-platform: ~/Documents/agent-llama (Mac/Linux) or C:\Users\{user}\Documents\agent-llama (Windows)
 * Falls back to accessible alternatives if Documents folder is restricted
 */
export function getDefaultWorkingDirectory(): string {
  const homeDir = os.homedir();
  const documentsDir = path.join(homeDir, 'Documents', 'agent-llama');
  
  // Check if Documents directory is accessible
  try {
    fs.accessSync(path.join(homeDir, 'Documents'), fs.constants.R_OK | fs.constants.W_OK);
    return documentsDir;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // Documents folder is not accessible (likely due to macOS privacy permissions)
    console.warn('⚠️  Documents folder not accessible, using alternative directory');
    
    // Try alternative locations in order of preference
    const alternatives = [
      path.join(homeDir, 'agent-llama'), // Direct in home directory
      path.join(homeDir, 'Desktop', 'agent-llama'), // Desktop folder
      path.join('/tmp', 'agent-llama'), // Temporary directory
    ];
    
    for (const altDir of alternatives) {
      try {
        // Check if parent directory exists and is accessible
        const parentDir = path.dirname(altDir);
        fs.accessSync(parentDir, fs.constants.R_OK | fs.constants.W_OK);
        console.log('✅ Using alternative working directory:', altDir);
        return altDir;
      } catch {
        continue; // Try next alternative
      }
    }
    
    // Last resort: use current directory
    console.warn('⚠️  No accessible directories found, using current directory');
    return process.cwd();
  }
}

/**
 * Get the app data directory for storing database and app files
 * Cross-platform: ~/Documents/agent-llama-app
 * Falls back to accessible alternatives if Documents folder is restricted
 */
export function getAppDataDirectory(): string {
  const homeDir = os.homedir();
  const documentsAppDir = path.join(homeDir, 'Documents', 'agent-llama-app');
  
  // Check if Documents directory is accessible
  try {
    fs.accessSync(path.join(homeDir, 'Documents'), fs.constants.R_OK | fs.constants.W_OK);
    return documentsAppDir;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // Documents folder is not accessible, use alternative
    console.warn('⚠️  Documents folder not accessible for app data, using alternative');
    
    // Try alternative locations
    const alternatives = [
      path.join(homeDir, '.agent-llama'), // Hidden directory in home
      path.join(homeDir, 'agent-llama-app'), // Direct in home directory
      path.join('/tmp', 'agent-llama-app'), // Temporary directory
    ];
    
    for (const altDir of alternatives) {
      try {
        const parentDir = path.dirname(altDir);
        fs.accessSync(parentDir, fs.constants.R_OK | fs.constants.W_OK);
        console.log('✅ Using alternative app data directory:', altDir);
        return altDir;
      } catch {
        continue;
      }
    }
    
    // Last resort: use current directory
    console.warn('⚠️  No accessible directories found for app data, using current directory');
    return process.cwd();
  }
}

/**
 * Expand tilde (~) in path to actual home directory
 * Works cross-platform
 */
export function expandPath(dirPath: string): string {
  if (!dirPath) return dirPath;

  // If path starts with ~, replace with home directory
  if (dirPath.startsWith('~/') || dirPath === '~') {
    const homeDir = os.homedir();
    const expanded = dirPath === '~'
      ? homeDir
      : path.join(homeDir, dirPath.slice(2));

    console.log('🔄 Path expansion:', {
      original: dirPath,
      expanded: expanded
    });

    return expanded;
  }

  // Return absolute path as-is
  return path.resolve(dirPath);
}

/**
 * Validate that a directory exists and is accessible
 * Provides helpful error messages for common macOS permission issues
 */
export function validateDirectory(dirPath: string): { valid: boolean; error?: string; expanded?: string; suggestion?: string } {
  try {
    // Expand path first
    const expanded = expandPath(dirPath);

    // Check if path exists
    if (!fs.existsSync(expanded)) {
      console.warn('⚠️  Directory does not exist:', expanded);
      return {
        valid: false,
        error: 'Directory does not exist',
        expanded,
        suggestion: 'The directory path may be incorrect or the folder may have been moved.'
      };
    }

    // Check if it's actually a directory (follows symlinks)
    const stats = fs.statSync(expanded);
    if (!stats.isDirectory()) {
      console.warn('⚠️  Path is not a directory:', expanded);
      return {
        valid: false,
        error: 'Path is not a directory',
        expanded,
        suggestion: 'The specified path points to a file, not a directory.'
      };
    }

    // Check if it's a symbolic link (log warning but allow)
    const lstat = fs.lstatSync(expanded);
    if (lstat.isSymbolicLink()) {
      console.warn('⚠️  Path is a symbolic link:', expanded);
      console.log('🔗 Symlink target:', fs.realpathSync(expanded));
    }

    // Check read/write permissions by attempting to access
    try {
      fs.accessSync(expanded, fs.constants.R_OK | fs.constants.W_OK);
    } catch (accessError) {
      console.warn('⚠️  No read/write permissions:', expanded);
      
      // Check if this is a macOS privacy permission issue
      const isDocumentsFolder = expanded.includes('/Documents/');
      const isPermissionError = accessError instanceof Error && 
        (accessError.message.includes('Operation not permitted') || 
         accessError.message.includes('EACCES'));
      
      let suggestion = 'Check file permissions or try running with appropriate privileges.';
      
      if (isDocumentsFolder && isPermissionError) {
        suggestion = 'This appears to be a macOS privacy permission issue. Go to System Preferences > Security & Privacy > Privacy > Files and Folders, and grant access to Documents folder for your terminal application.';
      }
      
      return {
        valid: false,
        error: 'No read/write permissions',
        expanded,
        suggestion
      };
    }

    // Additional safety check: ensure directory is accessible
    try {
      fs.readdirSync(expanded);
    } catch (readError) {
      console.warn('⚠️  Directory not accessible:', expanded);
      
      let suggestion = 'The directory may have been deleted, moved, or become inaccessible.';
      
      // Check for specific macOS permission issues
      if (readError instanceof Error && readError.message.includes('Operation not permitted')) {
        suggestion = 'This appears to be a macOS privacy permission issue. Check System Preferences > Security & Privacy > Privacy > Files and Folders.';
      }
      
      return {
        valid: false,
        error: 'Directory not accessible (may be deleted or moved)',
        expanded,
        suggestion
      };
    }

    // Silent success - only log errors
    return {
      valid: true,
      expanded
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Directory validation error:', errorMessage);
    
    let suggestion = 'An unexpected error occurred while validating the directory.';
    
    // Provide specific guidance for common macOS issues
    if (errorMessage.includes('Operation not permitted')) {
      suggestion = 'This appears to be a macOS privacy permission issue. Check System Preferences > Security & Privacy > Privacy > Files and Folders to grant access to the required directories.';
    }
    
    return {
      valid: false,
      error: errorMessage,
      suggestion
    };
  }
}

/**
 * Create directory if it doesn't exist (including parent directories)
 */
export function ensureDirectory(dirPath: string): boolean {
  try {
    const expanded = expandPath(dirPath);

    if (fs.existsSync(expanded)) {
      console.log('📁 Directory already exists:', expanded);
      return true;
    }

    // Create directory recursively
    fs.mkdirSync(expanded, { recursive: true });
    console.log('✅ Directory created:', expanded);
    return true;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to create directory:', errorMessage);
    return false;
  }
}

/**
 * Get platform-specific information for diagnostic logging
 */
export function getPlatformInfo(): {
  os: string;
  platform: string;
  home: string;
  arch: string;
  version: string;
} {
  const info = {
    os: os.type(),
    platform: os.platform(),
    home: os.homedir(),
    arch: os.arch(),
    version: os.release()
  };

  // Startup logs are now consolidated in server.ts
  // console.log('💻 Platform info:', info);
  return info;
}

/**
 * Get directory access guidance for users experiencing permission issues
 */
export function getDirectoryAccessGuidance(): {
  isMacOS: boolean;
  hasDocumentsAccess: boolean;
  suggestions: string[];
  alternativeDirectories: string[];
} {
  const homeDir = os.homedir();
  const platform = os.platform();
  const isMacOS = platform === 'darwin';
  
  // Check Documents folder access
  let hasDocumentsAccess = false;
  try {
    fs.accessSync(path.join(homeDir, 'Documents'), fs.constants.R_OK | fs.constants.W_OK);
    hasDocumentsAccess = true;
  } catch {
    hasDocumentsAccess = false;
  }
  
  const suggestions: string[] = [];
  const alternativeDirectories: string[] = [];
  
  if (isMacOS && !hasDocumentsAccess) {
    suggestions.push(
      'This appears to be a macOS privacy permission issue.',
      'To fix this, go to: System Preferences > Security & Privacy > Privacy > Files and Folders',
      'Find your terminal application (Terminal, iTerm2, etc.) and grant access to Documents folder.',
      'Alternatively, you can use one of the alternative directories listed below.'
    );
    
    // Suggest alternative directories
    const alternatives = [
      path.join(homeDir, 'agent-llama'),
      path.join(homeDir, 'Desktop', 'agent-llama'),
      path.join('/tmp', 'agent-llama'),
      process.cwd()
    ];
    
    for (const altDir of alternatives) {
      try {
        const parentDir = path.dirname(altDir);
        fs.accessSync(parentDir, fs.constants.R_OK | fs.constants.W_OK);
        alternativeDirectories.push(altDir);
      } catch {
        continue;
      }
    }
  } else if (!hasDocumentsAccess) {
    suggestions.push(
      'The Documents folder is not accessible.',
      'Check file permissions or try running with appropriate privileges.',
      'Consider using an alternative directory.'
    );
  }
  
  return {
    isMacOS,
    hasDocumentsAccess,
    suggestions,
    alternativeDirectories
  };
}
