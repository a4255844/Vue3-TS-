export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}
export interface RespProps<P = {}> {
  code: number;
  msg: string;
  data: P;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: ImageProps;
  description: string;
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
  isHTML?: boolean;
}
export interface ListProps<P> {
  [id: string]: P;
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}
export interface ColumnPost {
  total: number;
  currentPage: number;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  isLoading: boolean;
  columns: { data: ListProps<ColumnProps>, total: number, currentPage: number };
  posts: { data: ListProps<PostProps>, loadedColumns: { [id: string] : ColumnPost } };
  user: UserProps;
}

// export const testData: ColumnProps[] = [
//   {
//     id: 1,
//     title: 'test1的专栏',
//     description: '之撒打算奥迪sadsad阿萨德sad阿萨德sad测试数据',
//     avatar: 'https://cn.vuejs.org/images/logo.svg'
//   },
//   {
//     id: 2,
//     title: 'test2的专栏',
//     description: '之撒打算奥迪sadsad阿萨德sad阿萨德sad测试数据',
//     avatar: 'https://cn.vuejs.org/images/logo.svg'
//   },
//   {
//     id: 3,
//     title: 'test3的专栏',
//     description: '之撒打算奥迪sadsad阿萨德sad阿萨德sad测试数据',
//     avatar: 'https://cn.vuejs.org/images/logo.svg'
//   },
//   {
//     id: 4,
//     title: 'test4的专栏',
//     description: '之撒打算奥迪sadsad阿萨德sad阿萨德sad测试数据',
//     avatar: 'https://cn.vuejs.org/images/logo.svg'
//   }
// ]

// export const testPosts: PostProps[] = [
//   {
//     id: 1,
//     title: '只是我的第一篇文章,大萨达奥迪sad阿萨德阿萨德阿萨德按时',
//     content: 'sadsaddddddddddddddddd wdqdq dsad sa dsa dsa dsa dsadsa dsa',
//     image: 'https://cn.vuejs.org/images/logo.svg',
//     createdAt: '2020-06-11 10:34:22',
//     columnId: 1
//   },
//   {
//     id: 2,
//     title: '只是我的第2篇文章,大萨达奥迪sad阿萨德阿萨德阿萨德按时',
//     content: 'sadsaddddddddddddddddd wdqdq dsad sa dsa dsa dsa dsadsa dsa',
//     image: 'https://cn.vuejs.org/images/logo.svg',
//     createdAt: '2020-06-11 10:34:22',
//     columnId: 1
//   },
//   {
//     id: 3,
//     title: '只是我的第3文章,大萨达奥迪sad阿萨德阿萨德阿萨德按时',
//     content: 'sadsaddddddddddddddddd wdqdq dsad sa dsa dsa dsa dsadsa dsa',
//     createdAt: '2020-06-11 10:34:22',
//     columnId: 1
//   },
//   {
//     id: 4,
//     title: '只是我的第4篇文章,大萨达奥迪sad阿萨德阿萨德阿萨德按时',
//     content: 'sadsaddddddddddddddddd wdqdq dsad sa dsa dsa dsa dsadsa dsa',
//     image: 'https://cn.vuejs.org/images/logo.svg',
//     createdAt: '2020-06-11 10:34:22',
//     columnId: 2
//   },
//   {
//     id: 5,
//     title: '只是我的第5篇文章,大萨达奥迪sad阿萨德阿萨德阿萨德按时',
//     content: 'sadsaddddddddddddddddd wdqdq dsad sa dsa dsa dsa dsadsa dsa',
//     image: 'https://cn.vuejs.org/images/logo.svg',
//     createdAt: '2020-06-11 10:34:22',
//     columnId: 2
//   },
//   {
//     id: 6,
//     title: '只是我的第6篇文章,大萨达奥迪sad阿萨德阿萨德阿萨德按时',
//     content: 'sadsaddddddddddddddddd wdqdq dsad sa dsa dsa dsa dsadsa dsa',
//     image: 'https://cn.vuejs.org/images/logo.svg',
//     createdAt: '2020-06-11 10:34:22',
//     columnId: 3
//   }
// ]
