import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LessonFlow from "@/components/LessonFlow";
import type { Lesson, Puzzle, QuizQuestion } from "@/types";

export default async function LessonPage({ params }: { params: { lessonId: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", params.lessonId)
    .single<Lesson>();

  if (!lesson) redirect("/dashboard");

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("lesson_id", lesson.id)
    .order("order_index")
    .returns<QuizQuestion[]>();

  const { data: puzzle } = await supabase
    .from("puzzles")
    .select("*")
    .eq("lesson_id", lesson.id)
    .maybeSingle<Puzzle>();

  return (
    <LessonFlow
      userId={user.id}
      lesson={lesson}
      questions={questions ?? []}
      puzzle={puzzle ?? null}
    />
  );
}
