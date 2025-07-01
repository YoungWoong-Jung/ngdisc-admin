export interface test_cate {
    test_cate_id: number;
    test_cate_name: string;
    test_cate_img?: string;
    test_cate_useyn: boolean;
    test_cate_desc?: string;
    add_user_id?: string;
    add_date?: Date;
    update_user_id?: string;
    update_date?: Date;
    test_cate_thumbnail?: string;
    test?: test[];
    ticket_dtl?: ticket_dtl[];
}

export interface test {
    test_cate_id: number;
    test_id: number;
    test_classify: string;
    test_title: string;
    test_desc?: string;
    test_start_date?: Date;
    test_end_date?: Date;
    test_random_sort: boolean;
    test_status?: string;
    test_revision: number;
    test_version: number;
    test_memo?: string;
    test_tags?: string;
    add_user_id?: string;
    add_date?: Date;
    update_user_id?: string;
    update_date?: Date;
    test_logic?: string;
    test_img?: string;
    test_thumbnail?: string;
    test_free: boolean;
    report_id?: number;
    profile_card_template_id?: number;
    question_count?: string;
    time_taken?: string;
    question?: question[];
    report_user?: report_user[];
    profile_card_template?: profile_card_template;
    report?: report;
    test_cate: test_cate;
    classify: etccd;
    logic?: etccd;
    status?: etccd;
    test_user?: test_user[];
    ticket_dtl?: ticket_dtl[];
}

export interface question {
    test_id: number;
    question_id: number;
    question_content: string;
    question_desc?: string;
    question_type: string;
    question_random_sort: boolean;
    question_required: boolean;
    question_memo?: string;
    add_user_id?: string;
    add_date?: Date;
    update_user_id?: string;
    update_date?: Date;
    type: etccd;
    test: test;
    question_item?: question_item[];
}

export interface question_item {
    question_id: number;
    question_item_id: number;
    question_item_content: string;
    question_item_useyn: boolean;
    question_item_d_score: number;
    question_item_i_score: number;
    question_item_s_score: number;
    question_item_c_score: number;
    add_user_id?: string;
    add_date?: Date;
    update_user_id?: string;
    update_date?: Date;
    question: question;
    test_user_answer?: test_user_answer[];
}
