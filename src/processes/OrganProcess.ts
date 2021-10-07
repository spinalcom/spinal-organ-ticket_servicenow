/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
import {
  SpinalGraph,
  SpinalGraphService,
} from 'spinal-env-viewer-graph-service';
import type OrganConfigModel from '../model/OrganConfigModel';
import SpinalIO from '../services/SpinalIO';
import OrganConfig from './OrganConfig';
import type IStatus from './status/IStatus';
import StandBy from './status/StandBy';
import SyncRun from './status/SyncRun';

export class OrganProcess {
  config: OrganConfigModel;
  graph: SpinalGraph<any>;
  mapStatusHandler: Map<number, IStatus> = new Map();
  constructor() {}

  async init() {
    const organConfig = OrganConfig.getInstance();
    this.config = await organConfig.getConfig();
    const spinalIO = SpinalIO.getInstance();
    try {
      this.graph = await spinalIO.load(this.config.digitalTwinPath.get());
      SpinalGraphService.setGraph(this.graph);
    } catch (e) {
      console.error(
        'Imposible to load the graph,',
        this.config.digitalTwinPath.get()
      );
    }

    this.mapStatusHandler.set(0, new StandBy());
    this.mapStatusHandler.set(3, new SyncRun(this.graph, this.config));
  }

  async run() {
    const currentHandler: IStatus = this.mapStatusHandler.get(3);
    await currentHandler.start();
  }
}
