export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  title: string;
  difficulty: string;
  statement: string;
  examples: Example[];
  slug: string;
  acceptance?: string;
  tags?: string[];
  category?: string;
}
