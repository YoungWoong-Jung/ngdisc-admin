// 보고서 관련 인터페이스들

import { profile_card_template } from "./profile";
import { test } from "./test";
import { etccd } from "./etccd";

export interface report {
  report_id: number;
  report_classify?: string;
  report_template_id?: number;
  report_title: string;
  report_revision: number;
  report_version: number;
  add_user_id?: string;
  add_date?: Date;
  update_user_id?: string;
  update_date?: Date;
  report_status?: string;
  profile_card_template_id?: number;
  profile_card_template?: profile_card_template;
  classify?: etccd;
  status?: etccd;
  report_template?: report_template;
  report_content?: report_content[];
  report_user?: report_user[];
  test?: test[];
}

export interface report_template {
  report_template_id: number;
  report_template_title: string;
  add_user_id?: string;
  add_date?: Date;
  update_user_id?: string;
  update_date?: Date;
  report?: report[];
  report_template_config?: report_template_config[];
}

export interface report_template_config {
  report_template_id: number;
  report_template_config_id: number;
  report_template_config_seq: number;
  report_template_config_default?: string;
  report_template_config_useyn: boolean;
  add_user_id?: string;
  add_date?: Date;
  update_user_id?: string;
  update_date?: Date;
  report_template_config_page_name?: string;
  report_template_config_type: string;
  report_template_config_common?: boolean;
  config_type: etccd;
  report_template: report_template;
}

export interface report_content {
  report_id: number;
  report_content_id: number;
  disc_type: string;
  content_type: string;
  seq: number;
  page_name: string;
  content: string;
  report_content_useyn: boolean;
  add_user_id?: string;
  add_date?: Date;
  update_user_id?: string;
  update_date?: Date;
  report: report;
}

export interface report_user {
    public_id: string;
    test_id: number;
    test_user_id: number;
    report_id: number;
    user_id: number;
    score_d?: number;
    score_i?: number;
    score_s?: number;
    score_c?: number;
    convert_d?: number;
    convert_i?: number;
    convert_s?: number;
    convert_c?: number;
    disc_type?: string;
    rep_type?: string;
    add_user_id?: string;
    add_date?: Date;
    update_user_id?: string;
    update_date?: Date;
    report_user_id: number;
    profile_card_user?: profile_card_user;
    report?: report;
    test?: test;
    test_user?: test_user;
    user?: user;
}