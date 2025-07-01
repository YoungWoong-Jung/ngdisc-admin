export interface admin_menu_cate {
    menu_cate_id: number;
    menu_cate_name: string;
    seq: number;
    menu_cate_useyn: boolean;
    menu_cate_icon?: string;
    add_user_id?: string;
    add_date?: Date;
    update_user_id?: string;
    update_date?: Date;
    admin_menu?: admin_menu[];
}

export interface admin_menu {
    menu_cate_id: number;
    menu_id: number;
    menu_name: string;
    menu_icon?: string;
    menu_url: string;
    seq: number;
    menu_useyn: boolean;
    menu_status: string;
    menu_role?: string;
    add_user_id?: string;
    add_date?: Date;
    update_user_id?: string;
    update_date?: Date;
    menu_cate?: admin_menu_cate;
}