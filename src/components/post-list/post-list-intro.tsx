type Props = {
  classroomName: string | null;
};

export default function PostListIntro({ classroomName }: Props) {
  if (!classroomName) return null;

  return (
    <div className="px-page-x bg-white pb-5">
      <h1 className="text-xl font-bold tracking-tight text-gray-700">
        {classroomName} 독서장
      </h1>

      <p className="mt-1 text-sm leading-6 text-gray-500">
        {classroomName} 친구들의 독후감을 공유해주세요😊
      </p>
    </div>
  );
}
