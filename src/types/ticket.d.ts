import { test, test_cate } from "./test";

export interface ticket {
  /// 이용권 아이디
  ticket_id: number;
  /// 이용권 이름
  ticket_name: string;
  /// 이용권 가격
  ticket_price?: number;
  /// 이용권 사용기간 (일수)
  ticket_due: number;
  /// 티켓 섬네일
  ticket_thumbnail?: string;
  /// 이용권 사용 여부
  ticket_useyn: boolean;
  /// 공통
  add_user_id?: string;
  add_date?: Date;
  update_user_id?: string;
  update_date?: Date;
  /// 관계
  ticket_dtl?: ticket_dtl[];
  ticket_user?: ticket_user[];  
}

export interface ticket_dtl {
  /// 이용권 아이디
  ticket_id: number;
  /// 이용권 세부정보 아이디
  ticket_dtl_id: number;
  /// 시용가능한 test_cate_id
  test_cate_id?: number;
  /// 사용가능한 test_id
  test_id?: number;
  /// 사용가능한 test_classify
  test_classify?: string;
  /// 사용 여부
  ticket_dtl_useyn: boolean;
  /// 공통
  add_user_id?: string;
  add_date?: Date;
  update_user_id?: string;
  update_date?: Date;
  /// 관계
  test_cate?: test_cate;
  classify?: etccd;
  test?: test;
  ticket?: ticket;
}


export interface ticket_user {
    /// 이용권 아이디
    ticket_id: number;
    /// 이용권 부여 아이디
    ticket_user_id: number;
    /// 이용권 소유자
    user_id: number;
    /// 이용권 유효기간 시작일
    ticket_user_start_date: Date;
    /// 이용권 이용기간 종료일
    ticket_user_end_date: Date;
    /// 이용권 사용가능 여부
    ticket_user_useyn: boolean;
    /// 공통
    add_user_id?: string;
    add_date?: Date;
    update_user_id?: string;
    update_date?: Date;
    /// 이용권 사용일
    ticket_user_use_date?: Date;
    /// 관계
    ticket?: ticket;
  }