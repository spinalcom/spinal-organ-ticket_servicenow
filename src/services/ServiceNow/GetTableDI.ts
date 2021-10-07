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
  axiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
} from '../../utils/axiosInstance';

export interface IApiGETTableRes {
  result: IResultItem[];
}
export interface IResultItem {
  parent: string;
  sla_suspended_reason: string;
  u_value_installments_paid_reais: string;
  watch_list: string;
  upon_reject: string;
  sys_updated_on: string;
  qualification_group: string;
  type: string;
  expected_end: string;
  approval_history: string;
  skills: string;
  number: string;
  u_category_task: string;
  u_quotation_needed: string;
  previous_agent: string;
  state: string;
  sys_created_by: string;
  template_workflow_invoked: string;
  knowledge: string;
  order: string;
  u_amount_receivable_reais: string;
  cmdb_ci: string;
  impact: string;
  active: string;
  priority: string;
  sys_domain_path: string;
  sla_suspended: string;
  u_record_producer: string | IU_record_producer;
  business_duration: string;
  group_list: string;
  u_proof_needed: string;
  universal_request: string;
  template: string;
  short_description: string;
  correlation_display: string;
  work_start: string;
  request_type: string;
  additional_assignee_list: string;
  u_answered: string;
  assigned_vendor: string;
  sys_class_name: string;
  closed_by: string;
  follow_up: string;
  sla_suspended_on: string;
  u_iof_discount_amount_reais: string;
  estimated_end: string;
  vendor_reference: string;
  reassignment_count: string;
  u_has_new_attachment: string;
  assigned_to: string | IAssigned_to;
  request_category: string;
  requested_due_by: string;
  u_sub_category_task: string;
  sla_suspended_for: string;
  sla_due: string;
  opened_for: IOpened_for;
  u_request_information: string;
  u_pending_amount_discount_reais: string;
  u_room: string;
  substate: string;
  u_reopen_count: string;
  escalation: string;
  upon_approval: string;
  correlation_id: string;
  asset: string;
  spam: string;
  made_sla: string;
  u_payment_date: string;
  is_catalog: string;
  sn_esign_document: string;
  task_effective_number: string;
  u_liquid_withdraw_value_reais: string;
  sys_updated_by: string;
  opened_by: IOpened_by;
  user_input: string;
  sys_created_on: string;
  sys_domain: ISys_domain;
  details: string;
  route_reason: string;
  closed_at: string;
  u_comments_and_work_notes: string;
  u_withdraw_value_reais: string;
  business_service: string;
  u_iof: string;
  time_worked: string;
  expected_start: string;
  opened_at: string;
  task_created: string;
  work_end: string;
  fulfillment_instructions: string;
  subcategory: string;
  work_notes: string;
  u_owner: IU_owner;
  u_invoice_date: string;
  initiated_from: string;
  assignment_group: IAssignment_group;
  description: string;
  u_withdraw_value_euros: string;
  calendar_duration: string;
  u_source: string;
  close_notes: string;
  sys_id: string;
  contact_type: string;
  sn_esign_esignature_configuration: string;
  urgency: string;
  company: ICompany;
  department: string;
  u_exchange_rate: string;
  activity_due: string;
  comments: string;
  approval: string;
  due_date: string;
  sys_mod_count: string;
  sys_tags: string;
  billable: string;
  caller: ICaller;
  u_customer_account: string;
  location: ILocation;
  u_amount_invested_reais: string;
  category: string;
}
interface IOpened_for {
  link: string;
  value: string;
}
interface IOpened_by {
  link: string;
  value: string;
}
interface ISys_domain {
  link: string;
  value: string;
}
interface IU_owner {
  link: string;
  value: string;
}
interface IAssignment_group {
  link: string;
  value: string;
}
interface ICompany {
  link: string;
  value: string;
}
interface ICaller {
  link: string;
  value: string;
}
interface ILocation {
  link: string;
  value: string;
}
interface IAssigned_to {
  link: string;
  value: string;
}
interface IU_record_producer {
  link: string;
  value: string;
}

export default async function GetTableDI(
  username: string,
  password: string
): Promise<IApiGETTableRes> {
  const auth = Buffer.from(`${username}:${password}`, 'binary').toString(
    'base64'
  );
  const sysparm_query = encodeURI(
    'active=true^assignment_group=bfe0564e1ba2770053aea64f2e4bcb33'
  );
  var config: AxiosRequestConfig = {
    method: 'get',
    url: `/api/now/table/facilities_request?sysparm_query=${sysparm_query}`,
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${auth}`,
    },
  };

  const response = await axiosInstance(config);
  return response.data;
}

export { GetTableDI };
