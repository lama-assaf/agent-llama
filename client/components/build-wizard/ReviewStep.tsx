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

import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import type { ProjectTemplate } from './buildConfig';

interface ReviewStepProps {
  template: ProjectTemplate;
  projectName: string;
  selectedFeatures: Set<string>;
  configurations: Record<string, string | boolean | number>;
}

export function ReviewStep({
  template,
  projectName,
  selectedFeatures,
  configurations,
}: ReviewStepProps) {
  const selectedFeaturesList = template.features.filter(f => selectedFeatures.has(f.id));

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '500px',
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
          <CheckCircle2 style={{ width: '32px', height: '32px', color: 'rgb(74, 222, 128)' }} />
        </div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 600,
          color: 'white',
          marginBottom: '8px',
        }}>
          Ready to build!
        </h2>
        <p style={{
          color: 'rgb(156, 163, 175)',
          fontSize: '14px',
        }}>
          Review your selections before we start
        </p>
      </div>

      {/* Review Content */}
      <div style={{
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {/* Project Summary Card */}
        <div style={{
          padding: '16px',
          borderRadius: '10px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgb(38, 40, 42)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'start',
            gap: '12px',
          }}>
            <div
              style={{
                padding: '10px',
                borderRadius: '8px',
                flexShrink: 0,
                backgroundImage: template.gradient,
                backgroundSize: '200% auto',
                animation: 'shimmer 3s linear infinite',
              }}
            >
              <div style={{
                color: '#000000',
                fontWeight: 700,
                fontSize: '16px',
              }}>
                {template.name.split(' ')[0].slice(0, 2).toUpperCase()}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'white',
                marginBottom: '4px',
              }}>
                {projectName}
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'rgb(156, 163, 175)',
              }}>
                {template.name} • {selectedFeatures.size} feature{selectedFeatures.size !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Selected Features */}
        <div style={{
          padding: '16px',
          borderRadius: '10px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgb(38, 40, 42)',
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'white',
            marginBottom: '12px',
          }}>
            Selected Features
          </h4>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {selectedFeaturesList.map((feature) => {
              const configs = feature.configOptions
                ?.map(opt => {
                  const value = configurations[opt.id];
                  if (value) {
                    return `${opt.label}: ${value}`;
                  }
                  return null;
                })
                .filter(Boolean);

              return (
                <div
                  key={feature.id}
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <CheckCircle2 style={{
                    width: '18px',
                    height: '18px',
                    color: 'rgb(74, 222, 128)',
                    flexShrink: 0,
                    marginTop: '2px',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '14px',
                    }}>
                      {feature.name}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: 'rgb(156, 163, 175)',
                      marginTop: '2px',
                    }}>
                      {feature.description}
                    </div>
                    {configs && configs.length > 0 && (
                      <div style={{
                        marginTop: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                      }}>
                        {configs.map((config, idx) => (
                          <div key={idx} style={{
                            fontSize: '12px',
                            color: 'rgb(107, 114, 128)',
                          }}>
                            • {config}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What Happens Next */}
        <div style={{
          padding: '16px',
          borderRadius: '10px',
          border: '2px solid rgba(59, 130, 246, 0.2)',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'start',
            gap: '12px',
            marginBottom: '12px',
          }}>
            <Sparkles style={{
              width: '18px',
              height: '18px',
              color: 'rgb(96, 165, 250)',
              flexShrink: 0,
              marginTop: '2px',
            }} />
            <h4 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'white',
            }}>
              What happens next?
            </h4>
          </div>
          <ol style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '13px',
            color: 'rgb(209, 213, 219)',
            marginLeft: '30px',
          }}>
            <li style={{
              display: 'flex',
              alignItems: 'start',
              gap: '8px',
            }}>
              <span style={{
                color: 'rgb(96, 165, 250)',
                fontWeight: 500,
              }}>1.</span>
              <span>I&apos;ll initialize your project using the latest stable version</span>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'start',
              gap: '8px',
            }}>
              <span style={{
                color: 'rgb(96, 165, 250)',
                fontWeight: 500,
              }}>2.</span>
              <span>Install and configure all selected features</span>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'start',
              gap: '8px',
            }}>
              <span style={{
                color: 'rgb(96, 165, 250)',
                fontWeight: 500,
              }}>3.</span>
              <span>Set up development environment and tooling</span>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'start',
              gap: '8px',
            }}>
              <span style={{
                color: 'rgb(96, 165, 250)',
                fontWeight: 500,
              }}>4.</span>
              <span>Provide you with next steps and usage instructions</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
