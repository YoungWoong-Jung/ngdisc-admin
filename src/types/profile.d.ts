import { report } from "./report";

// 프로필카드 템플릿 인터페이스
export interface profile_card_template {
  profile_card_template_id: number;
  profile_card_template_useyn: boolean;
  profile_card_template_name: string;
  profile_card_default_design: string;
  add_user_id?: string;
  add_date?: Date;
  update_user_id?: string;
  update_date?: Date;
  profile_card_content?: profile_card_content[];
  profile_card_user?: profile_card_user[];
  report?: report[]; // report 타입은 별도 정의 필요
}

// 프로필카드 템플릿 설정 인터페이스
export interface profile_card_content {
  profile_card_template_id: number;
  profile_card_content_id: number;
  profile_card_design: string;
  disc_type: string;
  image: string;
  animation: string;
  content_1?: string;
  content_2?: string;
  content_3?: string;
  content_4?: string;
  content_5?: string;
  content_6?: string;
  add_user_id?: string;
  add_date?: Date;
  update_user_id?: string;
  update_date?: Date;
  profile_card_template?: profile_card_template;
}

// 프로필카드 사용자 인터페이스
export interface profile_card_user {
  profile_card_user_id: number;
  user_id: number;
  profile_card_design: string;
  rep_type: string;
  image: string;
  animation: string;
  content_1?: string;
  content_2?: string;
  content_3?: string;
  content_4?: string;
  content_5?: string;
  content_6?: string;
  representative_yn: boolean;
  profile_card_user_useyn: boolean;
  add_user_id?: string;
  add_date?: Date;
  update_user_id?: string;
  update_date?: Date;
  report_user_id: number;
  report_user?: report_user; // report_user 타입은 별도 정의 필요
  user?: user; // user 타입은 별도 정의 필요
}