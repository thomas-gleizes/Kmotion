import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Interval } from '@nestjs/schedule';
import { RefreshConversionsCommand } from 'src/music/application/commands/refresh-conversions/refresh-conversions.command';

/** How often pending conversions are checked against the converter. */
export const REFRESH_CONVERSIONS_INTERVAL_MS = 15_000;

@Injectable()
export class RefreshConversionsTask {
  private readonly logger = new Logger(RefreshConversionsTask.name);
  private isRunning = false;

  constructor(private readonly commandBus: CommandBus) {}

  @Interval(REFRESH_CONVERSIONS_INTERVAL_MS)
  async refresh() {
    if (this.isRunning) return;
    this.isRunning = true;

    try {
      const changed = await this.commandBus.execute(
        new RefreshConversionsCommand(undefined),
      );
      if (changed > 0) this.logger.log(`Updated ${changed} conversion(s)`);
    } catch (error) {
      this.logger.error('Failed to refresh conversions', error);
    } finally {
      this.isRunning = false;
    }
  }
}
