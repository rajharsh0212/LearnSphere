import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Rating from "../../components/student/Rating";
import Footer from "../../components/student/Footer";
import Youtube from "react-youtube";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [openSections, setOpenSections] = useState({
    0: true,
  });
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const {
    allCourses,
    currency,
    calculateAverageRating,
    calculateCourseChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    backendUrl,
    userData,
  } = useContext(AppContext);
  const { auth } = useContext(AuthContext);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : url;
  };

  const fetchCourseData = async () => {
    // const course = await allCourses.find((course) => course._id === id);

    const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
    if (data.success) {
      setCourseData(data.course);
      setDaysLeft(data.daysLeft);
    } else {
      toast.error(data.message);
    }
  };

  const toggleOpenSections = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const purchaseCourse = async () => {
    try {
      if (!userData) {
        toast.warning("Please login to enroll in the course");
        return;
      }
      if (isAlreadyEnrolled) {
        toast.warning("You are already enrolled in this course");
        return;
      }
      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId: courseData._id },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        window.location.replace(data.session_url);
        // setIsAlreadyEnrolled(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [allCourses]);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData?._id));
    }
  }, [userData, courseData]);

  return (
    <div className="bg-gray-50">
      {courseData ? (
        <>
          <div className="flex md:flex-row flex-col-reverse gap-12 lg:gap-16 relative items-start justify-center md:px-12 lg:px-20 xl:px-32 px-6 md:pt-28 pt-20 pb-16 text-left">
            <div className="absolute top-0 left-0 w-full md:h-[450px] h-[350px] -z-10 bg-gradient-to-b from-sky-100 to-gray-50"></div>
            {/* left */}
            <div className="md:max-w-3xl w-full z-10 text-gray-600">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                {courseData.courseTitle}
              </h1>
              <p
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription.slice(0, 200),
                }}
                className="pt-4 md:text-lg text-base text-gray-700"
              ></p>
              {/* review and rating */}
              <div className="flex items-center gap-2 mt-4">
                <p className="font-bold text-lg text-gray-800">{calculateAverageRating(courseData)}</p>
                <Rating rating={calculateAverageRating(courseData)} />
                <p className="text-sm text-gray-500">({courseData.courseRatings.length} ratings)</p>
              </div>
              <p className="text-sm mt-2">
                Course by{" "}
                <span className="text-indigo-600 font-medium underline">
                  {courseData.educator.name}
                </span>
              </p>
              <div className="pt-12">
                <h2 className="text-2xl font-bold text-gray-900">Course structure</h2>
                <div className="mt-5 space-y-3">
                  {courseData?.courseContent.map((chapter, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 bg-white mb-3 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md"
                    >
                      <div
                        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
                        onClick={() => toggleOpenSections(index)}
                      >
                        <div className="flex items-center gap-4">
            <img
                            className={`w-5 h-5 transform transition-transform ${
                              openSections[index] ? "rotate-180" : ""
                            } `}
                            src={assets.down_arrow_icon}
                            alt="down_arrow_icon"
                          />
                          <p className="font-semibold text-gray-800 md:text-lg">
                            {chapter.chapterTitle}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 hidden sm:block">
                          {chapter.chapterContent.length} lectures -{" "}
                          {calculateCourseChapterTime(chapter)}
                        </p>
                      </div>
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          openSections[index] ? "max-h-[1000px]" : "max-h-0"
                        }`}
                      >
                        <ul className="border-t border-gray-200 divide-y divide-gray-200">
                          {chapter.chapterContent.map((lecture, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-4 py-3 px-5 text-gray-800"
                            >
                              <img
                                src={assets.play_icon}
                                alt="play_icon"
                                className="w-5 h-5"
                              />
                              <div className="flex items-center justify-between w-full">
                                <p className="text-sm">
                                  {lecture.lectureTitle}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                  {lecture.isPreviewFree && (
                                    <p
                                      onClick={() =>
                                        setPlayerData({
                                          videoId: getYouTubeId(
                                            lecture.lectureUrl
                                          ),
                                        })
                                      }
                                      className="text-blue-600 font-medium cursor-pointer hover:underline"
                                    >
                                      Preview
                                    </p>
                                  )}
                                  <p className="text-gray-500">
                                    {humanizeDuration(
                                      lecture.lectureDuration * 60 * 1000,
                                      { units: ["h", "m"] }
                                    )}
                                  </p>
            </div>
          </div>
                            </li>
                          ))}
                        </ul>
        </div>
                    </div>
                  ))}
        </div>
      </div>

              <div className="pt-12">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex gap-6" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab("description")}
                            className={`${activeTab === 'description' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Course Description
                        </button>
                        <button
                            onClick={() => setActiveTab("comments")}
                            className={`${activeTab === 'comments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Comments
                        </button>
                    </nav>
                </div>
                {activeTab === "description" && (
                  <div className="pt-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Course Description
                    </h2>
                    <p
                      className="pt-4 text-gray-700 rich-text"
                      dangerouslySetInnerHTML={{
                        __html: courseData.courseDescription,
                      }}
                    ></p>
                  </div>
                )}
                {activeTab === "comments" && (
                  <div className="pt-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Comments
                    </h2>
                    <ul className="flex flex-col pt-6 gap-6">
                      {courseData.courseRatings.map((rating, index) => (
                        <li key={index} className="flex gap-4">
                          <img
                            src={rating.userId.imageUrl}
                            alt={rating.userId.imageUrl}
                            className="w-11 h-11 rounded-full object-cover"
                          />
                          <div className="flex flex-col gap-1.5">
                            <p className="font-semibold text-gray-800">
                              {rating.userId.name}
                            </p>
                            <p className="flex gap-1 items-center">
                              {[...Array(rating.rating)].map((_, i) => (
                                <img
                                  className="w-4 h-4"
                                  key={i}
                                  src={assets.star}
                                  alt="star"
                                />
                              ))}
                            </p>
                            <p className="text-gray-600">{rating.comment}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
            )}
          </div>
        </div>
            {/* right */}
            <div className="w-full md:w-[380px] lg:w-[420px] md:sticky md:top-28 z-20 shadow-2xl rounded-lg overflow-hidden bg-white">
              {playerData ? (
                <Youtube
                  videoId={playerData.videoId}
                  opts={{ playerVars: { autoplay: 1 } }}
                  iframeClassName="w-full aspect-video"
                />
              ) : (
                <img src={courseData.courseThumbnail} alt="courseThumbnail" className="w-full object-cover" />
              )}
              <div className="p-6">
                {daysLeft && (
                  <div className="flex items-center gap-2 bg-orange-100/80 rounded-full px-3 py-1 w-fit">
                    <img
                      className="w-4 h-4 animate-bounce"
                      src={assets.time_left_clock_icon}
                      alt="time_left_clock_icon"
                    />
                    <p className="text-sm text-orange-600 font-medium">
                      <span className="font-bold">{daysLeft} days</span> left
                      at this price
                    </p>
                  </div>
                )}
                <div className="flex gap-3 items-baseline pt-4">
                  <p className="text-gray-900 text-3xl md:text-4xl font-bold">
                    {currency}{" "}
                    {(
                      courseData.coursePrice -
                      (courseData.discount * courseData.coursePrice) / 100
                    ).toFixed(2)}
                  </p>
                  <p className="md:text-lg text-gray-500 line-through">
                    {currency} {courseData.coursePrice}
                  </p>
                  <p className="md:text-lg text-green-600 font-semibold">
                    {courseData.discount}% off
                  </p>
                </div>
                <div className="flex flex-col gap-3 pt-5 text-gray-600 text-sm border-t border-gray-200 mt-5">
                    <div className="flex items-center gap-3">
                        <img className="w-5 h-5" src={assets.rating_star} alt="star" />
                        <p><span className="font-semibold text-gray-800">{calculateAverageRating(courseData)}</span> average rating</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <img className="w-5 h-5" src={assets.time_clock_icon} alt="time_clock_icon" />
                        <p><span className="font-semibold text-gray-800">{calculateCourseDuration(courseData)}</span> total duration</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <img className="w-5 h-5" src={assets.lesson_icon} alt="lesson_icon" />
                        <p><span className="font-semibold text-gray-800">{calculateNoOfLectures(courseData)}</span> lectures</p>
                    </div>
                </div>
                {!isAlreadyEnrolled && auth.user?.currentRole === 'student' && (
                  <button
                    onClick={purchaseCourse}
                    className="mt-6 w-full py-3.5 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {"Enroll Now"}
                  </button>
                )}
                {isAlreadyEnrolled && (
                  <button
                    onClick={() => navigate(`/player/${courseData._id}`)}
                    className="mt-6 w-full py-3.5 text-white font-semibold bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    {"Go to Course"}
                  </button>
                )}
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <p className="text-lg font-semibold text-gray-900">
                    What's in the course?
                  </p>
                  <ul className="mt-3 space-y-2.5 text-sm text-gray-700">
                    {courseData.whatsInTheCourse &&
                      courseData.whatsInTheCourse
                        .split(";")
                        .map((item, index) => <li key={index} className="flex items-start gap-3">
                            <img src={assets.blue_tick_icon} alt="tick" className="w-4 h-4 mt-1" />
                            <span>{item}</span>
                        </li>)}
          </ul>
        </div>
      </div>
    </div>
          </div>
          <Footer />
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default CourseDetails;
