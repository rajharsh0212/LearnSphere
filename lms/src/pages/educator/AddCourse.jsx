import React, { useContext, useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../components/student/Loading";
import { AuthContext } from "../../context/AuthContext";

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [discountEndDate, setDiscountEndDate] = useState("");
  const [whatsInTheCourse, setWhatsInTheCourse] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContext);
  const { auth } = useContext(AuthContext);

  const handleChapter = (action, chapterId, newTitle = "") => {
    if (action === "add") {
      const newChapter = {
        chapterId: uniqid(),
        chapterTitle: "New Chapter",
        chapterContent: [],
        collapsed: false,
        isEditing: true,
      };
      setChapters([...chapters, newChapter]);
    } else if (action === "remove") {
      setChapters(chapters.filter((ch) => ch.chapterId !== chapterId));
    } else if (action === "toggle") {
      setChapters(
        chapters.map((ch) =>
          ch.chapterId === chapterId ? { ...ch, collapsed: !ch.collapsed } : ch
        )
      );
    } else if (action === "updateTitle") {
      setChapters(
        chapters.map((ch) =>
          ch.chapterId === chapterId
            ? { ...ch, chapterTitle: newTitle, isEditing: false }
            : ch
        )
      );
    } else if (action === "startEditing") {
      setChapters(
        chapters.map((ch) =>
          ch.chapterId === chapterId ? { ...ch, isEditing: true } : ch
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setShowPopup(true);
      setCurrentChapterId(chapterId);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            return {
              ...chapter,
              chapterContent: chapter.chapterContent.filter(
                (_, i) => i !== lectureIndex
              ),
            };
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureUrl) {
      return toast.error("Please fill in lecture title and URL.");
    }
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = { ...lectureDetails, lectureId: uniqid() };
          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, newLecture],
          };
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) return toast.error("Please select a thumbnail image.");
    if (!courseTitle.trim()) return toast.error("Please enter a course title.");
    if (coursePrice < 0 || discount < 0 || discount > 100) return toast.error("Invalid price or discount.");
    if (chapters.length === 0) return toast.error("Please add at least one chapter.");

    const courseDescription = quillRef.current.root.innerHTML;

    const courseData = {
      courseTitle,
      courseDescription,
      coursePrice: Number(coursePrice),
      discount: Number(discount),
      discountEndDate,
      whatsInTheCourse,
      isPublished,
      courseContent: chapters.map((chapter, chapterIndex) => ({
        chapterId: chapter.chapterId,
        chapterTitle: chapter.chapterTitle,
        chapterOrder: chapterIndex + 1,
        chapterContent: chapter.chapterContent.map((lecture, lectureIndex) => ({
          lectureId: lecture.lectureId,
          lectureTitle: lecture.lectureTitle,
          lectureDuration: Number(lecture.lectureDuration),
          lectureUrl: lecture.lectureUrl,
          isPreviewFree: lecture.isPreviewFree,
          lectureOrder: lectureIndex + 1,
        })),
      })),
    };

    const formData = new FormData();
    formData.append("courseData", JSON.stringify(courseData));
    formData.append("image", image);

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Course added successfully!");
        // Clear all fields
        setCourseTitle("");
        setCoursePrice("");
        setDiscount("");
        setImage(null);
        setChapters([]);
        setDiscountEndDate("");
        setWhatsInTheCourse("");
        quillRef.current.root.innerHTML = "";
        setIsPublished(true);
      } else {
        toast.error(data.message || "Failed to add course.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Tell your students about this course...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });
    }
  }, []);

  return (
    <>
      {loading && <Loading />}
      <div className="bg-white p-4 sm:p-6 md:p-8">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Add New Course
            </h1>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center gap-2"
              disabled={loading}
            >
              <img src={assets.add_icon} alt="" className="w-5 h-5" />
              {loading ? "Saving..." : "Add Course"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Ultimate React Masterclass"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Description
                </label>
                <div ref={editorRef} style={{ height: "250px" }}></div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <label
                  htmlFor="thumbnailImage"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Course Thumbnail
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <img
                      src={
                        image
                          ? URL.createObjectURL(image)
                          : assets.upload_area
                      }
                      alt="upload"
                      className="mx-auto h-20 w-20 text-gray-400"
                    />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="thumbnailImage"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="thumbnailImage"
                          name="thumbnailImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImage(e.target.files[0])}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Course Price
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount End Date
                  </label>
                  <input
                    type="date"
                    value={discountEndDate}
                    onChange={(e) => setDiscountEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What's in the Course (comma-separated)
                  </label>
                  <textarea
                    value={whatsInTheCourse}
                    onChange={(e) => setWhatsInTheCourse(e.target.value)}
                    placeholder="e.g., 10 hours of video, 20 articles, 5 downloadable resources"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  ></textarea>
                </div>
                <div className="flex items-center">
                  <input
                    id="isPublished"
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                    Publish course immediately
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Course Content
            </h2>
            <div className="space-y-4">
              {chapters.map((chapter) => (
                <div
                  key={chapter.chapterId}
                  className="border border-gray-200 rounded-lg"
                >
                  <div className="p-3 bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.arrow_icon}
                        alt="toggle"
                        className={`w-4 h-4 cursor-pointer transition-transform ${
                          chapter.collapsed ? "-rotate-90" : ""
                        }`}
                        onClick={() => handleChapter("toggle", chapter.chapterId)}
                      />
                      {chapter.isEditing ? (
                        <input
                          type="text"
                          defaultValue={chapter.chapterTitle}
                          onBlur={(e) =>
                            handleChapter(
                              "updateTitle",
                              chapter.chapterId,
                              e.target.value
                            )
                          }
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            handleChapter(
                              "updateTitle",
                              chapter.chapterId,
                              e.target.value
                            )
                          }
                          autoFocus
                          className="px-2 py-1 border border-gray-300 rounded-md"
                        />
                      ) : (
                        <h3
                          className="font-medium text-gray-700 cursor-pointer"
                          onClick={() => handleChapter("startEditing", chapter.chapterId)}
                        >
                          {chapter.chapterTitle}
                        </h3>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleChapter("remove", chapter.chapterId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <img src={assets.cross_icon} alt="delete" className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                  {!chapter.collapsed && (
                    <div className="p-4 border-t border-gray-200">
                      {chapter.chapterContent.map((lecture, index) => (
                        <div
                          key={lecture.lectureId}
                          className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100"
                        >
                          <p className="text-sm text-gray-800">{lecture.lectureTitle}</p>
                          <button
                            type="button"
                            onClick={() =>
                              handleLecture("remove", chapter.chapterId, index)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <img src={assets.cross_icon} alt="delete" className="w-4 h-4"/>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleLecture("add", chapter.chapterId)}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        + Add Lecture
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleChapter("add")}
              className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-300 text-sm font-medium"
            >
              + Add Chapter
            </button>
          </div>
        </form>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add New Lecture</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Lecture Title"
                value={lectureDetails.lectureTitle}
                onChange={(e) =>
                  setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Lecture URL (e.g., YouTube, Vimeo)"
                value={lectureDetails.lectureUrl}
                onChange={(e) =>
                  setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Lecture Duration (in minutes)"
                value={lectureDetails.lectureDuration}
                onChange={(e) =>
                  setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="text-sm">Free Preview</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addLecture}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCourse;