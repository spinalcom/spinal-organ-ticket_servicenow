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

import type {
  SpinalContext,
  SpinalNode,
} from 'spinal-env-viewer-graph-service';
import { spinalServiceTicket } from 'spinal-service-ticket';
import { getProcessByStepId } from './getProcessByStepId';

export async function updateProcess(
  ticketNode: SpinalNode<any>,
  ticketProcess: string,
  context: SpinalContext<any>
) {
  const ticketId = ticketNode.info.id.get();
  const stepId = ticketNode.info.stepId.get();
  const processNode = await getProcessByStepId(stepId);
  if (processNode?.info.name.get() === ticketProcess) {
    return processNode;
  }
  const process = await context.getChildrenInContext(context);
  for (const proc of process) {
    if (proc.info.name.get() === ticketProcess) {
      await spinalServiceTicket.changeTicketProcess(
        ticketId,
        proc.info.id.get(),
        context.info.id.get()
      );
      return proc;
    }
  }
}
