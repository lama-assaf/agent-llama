/**
 * Agent Llama - Modern chat interface for Claude Agent SDK
 * Copyright (C) 2025 Safastak
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * AgentQueueManager - Limits concurrent agent execution with automatic queuing
 *
 * Purpose: Prevent system overload by enforcing a max concurrent agent limit.
 * When limit is reached, new agents are queued and auto-spawned when slots open.
 */

interface AgentTask {
  id: string;
  type: string;
  prompt: string;
  enqueuedAt: number;
}

interface RunningAgent {
  id: string;
  type: string;
  startedAt: number;
}

export class AgentQueueManager {
  private maxConcurrent: number;
  private runningAgents: Map<string, RunningAgent> = new Map();
  private queuedAgents: AgentTask[] = [];
  private onSpawnCallback?: (task: AgentTask) => void;

  constructor(maxConcurrent: number = 2) {
    this.maxConcurrent = maxConcurrent;
  }

  /**
   * Set callback for when queued agent should be spawned
   */
  setSpawnCallback(callback: (task: AgentTask) => void): void {
    this.onSpawnCallback = callback;
  }

  /**
   * Enqueue an agent task - either start immediately or queue
   */
  enqueueAgent(id: string, task: { type: string; prompt: string }): 'running' | 'queued' {
    const agentTask: AgentTask = {
      id,
      type: task.type,
      prompt: task.prompt,
      enqueuedAt: Date.now(),
    };

    if (this.runningAgents.size < this.maxConcurrent) {
      // Start immediately
      this.startAgent(agentTask);
      return 'running';
    } else {
      // Queue for later
      this.queuedAgents.push(agentTask);
      console.log(`⏸️ Agent queued: ${id} (${task.type}) - ${this.queuedAgents.length} in queue`);
      return 'queued';
    }
  }

  /**
   * Mark agent as complete and spawn next queued agent
   */
  markAgentComplete(id: string): void {
    if (!this.runningAgents.has(id)) {
      console.warn(`⚠️ Attempted to complete non-running agent: ${id}`);
      return;
    }

    const agent = this.runningAgents.get(id)!;
    const duration = Date.now() - agent.startedAt;
    this.runningAgents.delete(id);
    console.log(`✅ Agent completed: ${id} (${agent.type}) - Duration: ${duration}ms`);

    // Spawn next queued agent if available
    this.spawnNextQueued();
  }

  /**
   * Get count of running agents
   */
  getRunningCount(): number {
    return this.runningAgents.size;
  }

  /**
   * Get count of queued agents
   */
  getQueuedCount(): number {
    return this.queuedAgents.length;
  }

  /**
   * Check if agent is currently running
   */
  isAgentRunning(id: string): boolean {
    return this.runningAgents.has(id);
  }

  /**
   * Get queue status for logging/debugging
   */
  getStatus(): { running: number; queued: number; max: number } {
    return {
      running: this.runningAgents.size,
      queued: this.queuedAgents.length,
      max: this.maxConcurrent,
    };
  }

  /**
   * Start an agent (mark as running)
   */
  private startAgent(task: AgentTask): void {
    this.runningAgents.set(task.id, {
      id: task.id,
      type: task.type,
      startedAt: Date.now(),
    });
    console.log(`▶️ Agent started: ${task.id} (${task.type}) - ${this.runningAgents.size}/${this.maxConcurrent} running`);

    // Notify callback if set
    if (this.onSpawnCallback) {
      this.onSpawnCallback(task);
    }
  }

  /**
   * Spawn next queued agent if slot available
   */
  private spawnNextQueued(): void {
    if (this.queuedAgents.length === 0) {
      return; // No queued agents
    }

    if (this.runningAgents.size >= this.maxConcurrent) {
      return; // No slots available
    }

    const nextTask = this.queuedAgents.shift()!;
    const waitTime = Date.now() - nextTask.enqueuedAt;
    console.log(`🚀 Spawning queued agent: ${nextTask.id} (waited ${waitTime}ms)`);
    this.startAgent(nextTask);
  }
}
