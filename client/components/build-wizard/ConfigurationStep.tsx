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
import { Settings, HelpCircle } from 'lucide-react';
import type { ProjectTemplate } from './buildConfig';

interface ConfigurationStepProps {
  template: ProjectTemplate;
  selectedFeatures: Set<string>;
  configurations: Record<string, string | boolean | number>;
  onUpdateConfig: (key: string, value: string | boolean | number) => void;
  projectName: string;
  onProjectNameChange: (name: string) => void;
}

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

export function ConfigurationStep({
  template,
  selectedFeatures,
  configurations,
  onUpdateConfig,
  projectName,
  onProjectNameChange,
}: ConfigurationStepProps) {
  const [hoveredConfig, setHoveredConfig] = useState<string | null>(null);

  // Get all config options from selected features
  const configOptions = template.features
    .filter(f => selectedFeatures.has(f.id))
    .flatMap(f => (f.configOptions || []).map(opt => ({ ...opt, featureName: f.name })));

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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px',
        }}>
          <Settings style={{ width: '32px', height: '32px', color: 'rgba(255, 255, 255, 0.8)' }} />
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 600,
          color: 'white',
          marginBottom: '8px',
        }}>
          Configure your project
        </h2>
        <p style={{
          color: 'rgb(156, 163, 175)',
          fontSize: '14px',
        }}>
          Customize settings for your {template.name}
        </p>
      </div>

      {/* Configuration Form */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {/* Project Name */}
        <div style={{
          padding: '16px',
          borderRadius: '10px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgb(38, 40, 42)',
        }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: 'white',
            marginBottom: '8px',
          }}>
            Project Name *
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => {
              // Allow only lowercase letters, numbers, and dashes
              const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
              onProjectNameChange(cleaned);
            }}
            placeholder="my-awesome-project"
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'transparent',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 300ms',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          />
          <p style={{
            marginTop: '8px',
            fontSize: '12px',
            color: 'rgb(107, 114, 128)',
          }}>
            Lowercase letters, numbers, and dashes only
          </p>
        </div>

        {/* Feature Configurations */}
        {configOptions.length > 0 ? (
          configOptions.map((opt, index) => {
            const isHovered = hoveredConfig === opt.id;

            return (
              <div
                key={opt.id}
                className="promptCard waterfall"
                onMouseEnter={() => setHoveredConfig(opt.id)}
                onMouseLeave={() => setHoveredConfig(null)}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: 'rgb(38, 40, 42)',
                  animationDelay: `${index * 60}ms`,
                  position: 'relative',
                  zIndex: isHovered ? 10001 : 1,
                }}
              >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'white',
                }}>
                  {opt.label}
                  <span style={{
                    color: 'rgb(107, 114, 128)',
                    fontSize: '12px',
                    marginLeft: '8px',
                  }}>
                    ({opt.featureName})
                  </span>
                </label>
                {opt.tooltip && (
                  <Tooltip text={opt.tooltip}>
                    <HelpCircle
                      style={{
                        width: '14px',
                        height: '14px',
                        color: 'rgb(107, 114, 128)',
                        cursor: 'help',
                      }}
                    />
                  </Tooltip>
                )}
              </div>

              {opt.type === 'select' && opt.options ? (
                <>
                  <select
                    value={String(configurations[opt.id] || opt.defaultValue || opt.options[0].value)}
                    onChange={(e) => onUpdateConfig(opt.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '2px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgb(31, 41, 55)',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 300ms',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    {opt.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.recommended ? '★ ' : ''}{option.label}{option.recommended ? ' (Recommended)' : ''}
                      </option>
                    ))}
                  </select>
                  {(() => {
                    const selectedValue = String(configurations[opt.id] || opt.defaultValue || opt.options[0].value);
                    const selectedOption = opt.options.find(o => o.value === selectedValue);
                    return selectedOption?.tooltip ? (
                      <div style={{
                        marginTop: '8px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        fontSize: '12px',
                        lineHeight: '1.5',
                        color: 'rgb(147, 197, 253)',
                      }}>
                        {selectedOption.tooltip}
                      </div>
                    ) : null;
                  })()}
                </>
              ) : opt.type === 'toggle' ? (
                <button
                  onClick={() => onUpdateConfig(opt.id, !configurations[opt.id])}
                  style={{
                    width: '56px',
                    height: '32px',
                    borderRadius: '9999px',
                    position: 'relative',
                    backgroundColor: configurations[opt.id] ? 'rgb(59, 130, 246)' : 'rgb(75, 85, 99)',
                    transition: 'all 300ms',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      width: '24px',
                      height: '24px',
                      backgroundColor: 'white',
                      borderRadius: '9999px',
                      transform: configurations[opt.id] ? 'translateX(24px)' : 'translateX(0)',
                      transition: 'transform 300ms',
                    }}
                  />
                </button>
              ) : null}
            </div>
            );
          })
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '32px 0',
            color: 'rgb(107, 114, 128)',
            fontSize: '14px',
          }}>
            No additional configuration needed for selected features
          </div>
        )}
      </div>
    </div>
  );
}
