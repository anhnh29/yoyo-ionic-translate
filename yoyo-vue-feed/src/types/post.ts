interface IUserInfo {
  id: number;
  name: string;
  avatar: string;
}
export interface IComment {
  id: number;
  content: string;
  userInfo: IUserInfo;
  translatedContent?: string;
}

export interface IPostItem {
  id: number;
  image: string;
  title: string;
  content: string;
  comments: IComment[];
  authorInfor: IUserInfo;
  translatedContent?: string;
}
