import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import RatingComponent from "../../components/student/Rating";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../components/student/Loading";

const Player = () => {
  const { courseId } = useParams();
  const {
    enrolledCourses,
    calculateCourseChapterTime,
    userData,
    backendUrl,
  } = useContext(AppContext);
  const { auth } = useContext(AuthContext);
  const [courseData, setCourseData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);
  const [comment, setComment] = useState("");

  const [openSections, setOpenSections] = useState({
    0: true,
  });

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const fetchCourseData = async () => {
    await enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        setInitialRating(0);
        const userRating = course?.courseRatings?.find(
          (rating) => rating.userId?.toString() === userData?._id?.toString()
        );
        if (userRating) {
          setInitialRating(userRating.rating);
        }
      }
    });
  };

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (data.success) {
        getCourseProgress();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getCourseProgress = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/get-course-progress/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (data.success) {
        setProgressData(data.progressData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleRating = async (rating) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchCourseData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-comment`,
        { courseId: courseData._id, comment },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setComment("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.info(error.response.data.message);
    }
  };

  const toggleOpenSections = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  useEffect(() => {
    if (enrolledCourses) {
      fetchCourseData();
    }
  }, [enrolledCourses]);

  useEffect(() => {
    getCourseProgress();
  }, []);

  return (
    <>
      {!courseData && <Loading />}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/60 pt-32 pb-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:px-8 xl:px-10">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur md:p-5 text-gray-800 lg:sticky lg:top-32 lg:self-start">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg font-semibold text-slate-900">Course Structure</h2>
              <p className="text-xs font-medium text-slate-500">{courseData?.courseContent?.length || 0} sections</p>
            </div>
            <div className="pt-4">
            {courseData &&
              courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 transition-shadow duration-200 hover:shadow-md"
                >
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-white/80"
                    onClick={() => toggleOpenSections(index)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openSections[index] ? "rotate-180" : ""
                        } `}
                        src={assets.down_arrow_icon}
                        alt="down_arrow_icon"
                      />
                      <p className="font-medium text-sm md:text-base text-slate-900">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-xs font-medium text-slate-500 md:text-sm">
                      {chapter.chapterContent.length} lecture -{" "}
                      {calculateCourseChapterTime(chapter)}
                    </p>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openSections[index] ? "max-h-[28rem]" : "max-h-0"
                    }`}
                  >
                    <ul className="divide-y divide-slate-200 border-t border-slate-200 bg-white px-4 py-2 text-slate-600 md:px-5">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-3 py-3">
                          <img
                            src={
                              progressData &&
                              progressData.lectureCompleted.includes(
                                lecture.lectureId
                              )
                                ? assets.blue_tick_icon
                                : assets.play_icon
                            }
                            alt="play_icon"
                            className="mt-1 h-4 w-4 shrink-0"
                          />
                          <div className="flex w-full items-center justify-between gap-4 text-xs text-slate-800 md:text-sm">
                            <p className="truncate font-medium">
                              {lecture.lectureTitle}
                            </p>
                            <div className="flex shrink-0 items-center gap-3 text-xs text-slate-500">
                              {lecture.lectureUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="cursor-pointer font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                  Watch
                                </p>
                              )}
                              <p>
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
          <div className="flex items-center gap-2 py-3 mt-10">
                    <h1 className="text-xl font-bold text-slate-900">Rate this course:</h1>
            <RatingComponent
              initialRating={initialRating}
              onRate={handleRating}
            />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <h1 className="text-xl font-bold text-slate-900">Comment this course:</h1>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="button"
            onClick={handleCommentSubmit}
            className="mt-4 w-max rounded-xl bg-slate-900 px-8 py-3 font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
          >
            Submit
          </button>
        </div>
          <div>
          {playerData ? (
            <div className="sticky top-32 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur md:p-4">
              <YouTube
                videoId={getYouTubeId(playerData.lectureUrl)}
                opts={{ playerVars: { autoplay: 1 } }}
                iframeClassName="w-full aspect-video rounded-xl"
              />
              <div className="mt-4 flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
                <p className="font-semibold text-slate-900">
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </p>
                <button
                  className="shrink-0 font-medium text-blue-600 transition-colors hover:text-blue-700"
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                >
                  {progressData &&
                  progressData.lectureCompleted.includes(playerData.lectureId)
                    ? "✓ Completed"
                    : "Mark Completed"}
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <img
                src={courseData && courseData.courseThumbnail}
                alt="courseThumbnail"
                className="h-auto w-full"
              />
            </div>
          )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;
