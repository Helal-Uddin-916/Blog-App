const ProfileSkeleton = () => {
  return (
    <div className="w-full flex justify-center animate-pulse">
      <div className="w-[80%] flex max-lg:flex-col-reverse justify-evenly">

        {/* LEFT */}
        <div className="max-lg:w-full w-[50%]">
          <div className="hidden sm:flex justify-between my-10">
            <div className="h-10 w-48 bg-gray-300 rounded"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          </div>

          <div className="flex gap-6 my-4">
            <div className="h-5 w-20 bg-gray-300 rounded"></div>
            <div className="h-5 w-28 bg-gray-300 rounded"></div>
            <div className="h-5 w-28 bg-gray-300 rounded"></div>
          </div>

          {[1, 2, 3].map((_, i) => (
            <div key={i} className="my-6 space-y-3">
              <div className="h-6 w-full bg-gray-300 rounded"></div>
              <div className="h-4 w-[90%] bg-gray-200 rounded"></div>
              <div className="h-4 w-[80%] bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="max-lg:w-full w-[20%] lg:border-l max-lg:flex lg:pl-10">
          <div className="my-10 w-full">
            <div className="w-20 h-20 bg-gray-300 rounded-full"></div>

            <div className="h-5 w-32 bg-gray-300 rounded mt-4"></div>
            <div className="h-4 w-24 bg-gray-200 rounded mt-2"></div>

            <div className="h-4 w-full bg-gray-200 rounded mt-4"></div>
            <div className="h-4 w-[90%] bg-gray-200 rounded mt-2"></div>

            <div className="h-10 w-full bg-gray-300 rounded-full mt-6"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileSkeleton;
