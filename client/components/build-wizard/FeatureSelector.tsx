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

import React, { useState } from 'react';
import { Check, Lock, Database, Palette, Zap, Code2, Layers, HelpCircle, Sparkles } from 'lucide-react';
import type { ProjectTemplate } from './buildConfig';

interface FeatureSelectorProps {
  template: ProjectTemplate;
  selectedFeatures: Set<string>;
  onToggleFeature: (featureId: string) => void;
}

// Map feature IDs to icons
const FEATURE_ICONS: Record<string, React.ReactNode> = {
  'auth': <Lock style={{ width: '20px', height: '20px' }} />,
  'database': <Database style={{ width: '20px', height: '20px' }} />,
  'styling': <Palette style={{ width: '20px', height: '20px' }} />,
  'api': <Zap style={{ width: '20px', height: '20px' }} />,
  'framework': <Code2 style={{ width: '20px', height: '20px' }} />,
  'popup': <Layers style={{ width: '20px', height: '20px' }} />,
  'content-script': <Code2 style={{ width: '20px', height: '20px' }} />,
  'background': <Zap style={{ width: '20px', height: '20px' }} />,
  'routing': <Layers style={{ width: '20px', height: '20px' }} />,
  'state': <Database style={{ width: '20px', height: '20px' }} />,
  'testing': <Check style={{ width: '20px', height: '20px' }} />,
  'storage': <Database style={{ width: '20px', height: '20px' }} />,
};

// Simple Tooltip Component
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            backgroundColor: 'rgb(20, 22, 24)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '12px 16px',
            width: '420px',
            maxWidth: '90vw',
            fontSize: '13px',
            lineHeight: '1.6',
            color: 'rgb(229, 231, 235)',
            zIndex: 10000,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            pointerEvents: 'none',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

export function FeatureSelector({
  template,
  selectedFeatures,
  onToggleFeature,
}: FeatureSelectorProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      padding: '20px 32px',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 600,
          color: 'white',
          marginBottom: '8px',
        }}>
          Customize your {template.name}
        </h2>
        <p style={{
          color: 'rgb(156, 163, 175)',
          fontSize: '14px',
        }}>
          Select the features you want to include
        </p>
      </div>

      {/* Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto 32px',
      }}>
        {template.features.map((feature, index) => {
          const isSelected = selectedFeatures.has(feature.id);
          const isHovered = hoveredFeature === feature.id;

          return (
            <button
              key={feature.id}
              onClick={() => onToggleFeature(feature.id)}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="promptCard waterfall"
              style={{
                display: 'flex',
                alignItems: 'start',
                padding: '16px',
                borderRadius: '10px',
                border: '2px solid',
                cursor: 'pointer',
                textAlign: 'left',
                animationDelay: `${index * 60}ms`,
                backgroundColor: isSelected ? 'transparent' : 'rgb(38, 40, 42)',
                backgroundImage: isSelected ? template.gradient : 'none',
                borderColor: isSelected ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                transition: 'all 300ms',
                position: 'relative',
                zIndex: isHovered ? 10001 : 1,
                ...(isSelected ? {
                  backgroundSize: '200% auto',
                  animation: 'shimmer 3s linear infinite, waterfall 0.3s ease-out forwards',
                  animationDelay: `0s, ${index * 60}ms`,
                } : {}),
              }}
            >
              {/* Icon and Checkbox */}
              <div style={{
                display: 'flex',
                alignItems: 'start',
                gap: '12px',
                width: '100%',
              }}>
                {/* Icon */}
                <div
                  style={{
                    flexShrink: 0,
                    padding: '6px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                    color: isSelected ? '#000000' : 'rgb(156, 163, 175)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {FEATURE_ICONS[feature.id] || <Code2 style={{ width: '20px', height: '20px' }} />}
                </div>

                {/* Content */}
                <div style={{
                  flex: 1,
                  minWidth: 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: isSelected ? '#000000' : 'rgb(243, 244, 246)',
                    }}>
                      {feature.name}
                    </h3>
                    {feature.recommended && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)',
                        color: isSelected ? 'rgb(21, 128, 61)' : 'rgb(34, 197, 94)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                      }}>
                        <Sparkles style={{ width: '10px', height: '10px' }} />
                        Recommended
                      </span>
                    )}
                    {feature.tooltip && (
                      <Tooltip text={feature.tooltip}>
                        <HelpCircle
                          style={{
                            width: '14px',
                            height: '14px',
                            color: isSelected ? 'rgba(0, 0, 0, 0.5)' : 'rgb(107, 114, 128)',
                            cursor: 'help',
                          }}
                        />
                      </Tooltip>
                    )}
                  </div>
                  <p style={{
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: isSelected ? 'rgba(0, 0, 0, 0.7)' : 'rgb(156, 163, 175)',
                  }}>
                    {feature.description}
                  </p>
                  {feature.configOptions && feature.configOptions.length > 0 && (
                    <div style={{
                      marginTop: '6px',
                      fontSize: '11px',
                      color: isSelected ? 'rgba(0, 0, 0, 0.6)' : 'rgb(107, 114, 128)',
                    }}>
                      {feature.configOptions.length} configuration option{feature.configOptions.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Checkbox */}
                <div style={{
                  flexShrink: 0,
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  border: '2px solid',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 300ms',
                  borderColor: isSelected ? '#000000' : 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: isSelected ? '#000000' : 'transparent',
                }}>
                  {isSelected && (
                    <Check style={{ width: '14px', height: '14px', color: '#ffffff' }} />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
