export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          SpringLament Blog
        </h1>
        <p className="text-xl text-center text-gray-600">
          基于 Next.js 的全栈个人博客系统
        </p>
        <div className="mt-16 text-center">
          <p className="text-lg mb-4">项目正在建设中...</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">前端技术</h3>
              <p className="text-sm text-gray-600">Next.js 15, React 18</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">人工智能</h3>
              <p className="text-sm text-gray-600">AI相关技术分享</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">算法数据结构</h3>
              <p className="text-sm text-gray-600">计算机基础知识</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">生活随笔</h3>
              <p className="text-sm text-gray-600">个人感悟与思考</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
