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
  SpinalContext,
  SpinalGraphService,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import { IResultItem } from '../ServiceNow/GetTableDI';
import { spinalServiceTicket } from 'spinal-service-ticket';
import { getStepNameByApiName } from '../../utils/stepMatching';

export async function updateStep(
  ticketNode: SpinalNode<any>,
  ticket: IResultItem,
  context: SpinalContext<any>,
  processNode: SpinalNode<any>
) {
  const ticketId = ticketNode.info.id.get();
  const stepId = ticketNode.info.stepId.get();
  const stepNode = SpinalGraphService.getRealNode(stepId);
  const stepName = getStepNameByApiName(ticket.state);
  if (stepNode?.info.name.get() === stepName) {
    return stepNode;
  }
  const steps = await processNode.getChildrenInContext(context);
  for (const step of steps) {
    if (step.info.name.get() === stepName) {
      await spinalServiceTicket.moveTicket(
        ticketId,
        stepId,
        step.info.id.get(),
        context.info.id.get()
      );
      await spinalServiceTicket.addLogToTicket(
        ticketId,
        6,
        { name: ticket.sys_created_by, userId: 0 },
        stepId,
        step.info.id.get()
      );
      return step;
    }
  }
}
