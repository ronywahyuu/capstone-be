export class UserInterface {
  id: string;
  email: string;
  name: string;
  password: string;
}

export class PostDonasiInterface {
  id: string;
  slug: string;
  title: string;
  description: string;
  published: boolean;
  userId: string;
}

export class PostBlogInterface {
  id: string;
  slug: string;
  title: string;
  body: string;
  published: boolean;
  userId: string;
}

