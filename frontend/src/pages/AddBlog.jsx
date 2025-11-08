import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import NestedList from "@editorjs/nested-list";
import Marker from "@editorjs/marker";
import Underline from "@editorjs/underline";
import Embed from "@editorjs/embed";
import RawTool from "@editorjs/raw";
import TextVariantTune from "@editorjs/text-variant-tune";
import ImageTool from "@editorjs/image";
import { formatDate } from "../utils/formatDate";
import { removeSelectedBlog } from "../utils/selectedBlogSlice";
import { setIsOpen } from "../utils/commentSlice";

function AddBlog() {
  const { id } = useParams();
  const editorjsRef = useRef(null);
  const formData = new FormData();
  // const token = JSON.parse(localStorage.getItem("token"));

  const dispatch = useDispatch();
  const { token } = useSelector((slice) => slice.user);
  const { title, description, image, content, draft, tags } = useSelector(
    (slice) => slice.currentBlog
  );

  //   return token == null ? <Navigate to={"/signin"} /> : <div>Add Blog</div>;
  const navigate = useNavigate();

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
    content: "",
    tags: [],
    draft: false,
  });

  async function handleUpdateBlog() {
    let formData = new FormData();

    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    formData.append("image", blogData.image);
    formData.append("content", JSON.stringify(blogData.content));
    formData.append("tags", JSON.stringify(blogData.tags));
    formData.append("draft", blogData.draft);

    let existingImages = [];
    blogData.content.blocks.forEach((block) => {
      if (block.type === "image") {
        if (block.data.file.image) {
          formData.append("images", block.data.file.image);
        } else {
          existingImages.push({
            url: block.data.file.url,
            imageId: block.data.file.imageId,
          });
        }
      }
    });

    formData.append("existingImages", JSON.stringify(existingImages));
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function handlePostBlog() {
    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    formData.append("image", blogData.image);
    formData.append("content", JSON.stringify(blogData.content));
    formData.append("tags", JSON.stringify(blogData.tags));
    formData.append("draft", blogData.draft);

    blogData?.content?.blocks?.forEach((block) => {
      if (block.type === "image") {
        formData.append("images", block.data.file.image);
      }
    });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function fetchBlogbyId() {
    setBlogData({
      title: title,
      description: description,
      image: image,
      content: content,
      draft: draft,
      tags: tags,
    });
  }

  function initializeeditorjs() {
    editorjsRef.current = new EditorJS({
      holder: "editorjs",
      placeholder: "Write Something...",
      data: content,
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4],
            defaultLevel: 3,
          },
        },
        List: {
          class: NestedList,
          config: {},
          inlineToolbar: true,
        },
        Marker: Marker,
        Underline: Underline,
        Embed: Embed,
        raw: RawTool,
        textVariant: TextVariantTune,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (image) => {
                return {
                  success: 1,
                  file: {
                    url: URL.createObjectURL(image),
                    image,
                  },
                };
              },
            },
          },
        },
      },
      tunes: ["textVariant"],
      onChange: async () => {
        let data = await editorjsRef.current.save();
        setBlogData((blogData) => ({ ...blogData, content: data }));
      },
    });
  }

  function deleteTag(index) {
    const updatedTags = blogData.tags.filter(
      (_, tagIndex) => tagIndex !== index
    );
    setBlogData((prev) => ({ ...prev, tags: updatedTags }));
  }

  // function handleKeyDown(e) {
  //   const tag = e.target.value.toLowerCase();
  //   if (e.key == " ") {
  //     e.preventDefault();
  //   }

  //   if (e.key === "Enter" || tag !== "") {
  //     if (blogData.tags.length >= 10) {
  //       e.target.value = "";
  //       return toast.error("You can add upto maximum 10 tags");
  //     }
  //     if (blogData.tags.includes(tag)) {
  //       e.target.value = "";
  //       return toast.error("This Tag already added");
  //     }
  //     setBlogData((prev) => ({
  //       ...prev,
  //       tags: [...prev.tags, ...tag],
  //     }));
  //     e.target.value = "";
  //   }
  // }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault(); // stop form submit

      const tag = e.target.value.trim().toLowerCase();
      if (!tag) return;

      if (blogData.tags.length >= 10) {
        e.target.value = "";
        return toast.error("You can add upto maximum 10 tags");
      }

      if (blogData.tags.includes(tag)) {
        e.target.value = "";
        return toast.error("This Tag already added");
      }

      setBlogData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag], // ✅ correct array update
      }));

      e.target.value = "";
    }
  }

  useEffect(() => {
    if (editorjsRef.current === null) {
      initializeeditorjs();
    }

    return () => {
      editorjsRef.current = null;
      dispatch(setIsOpen(false));
      if (window.location.pathname !== `/edit-blog/${id}`) {
        dispatch(removeSelectedBlog());
      }
    };
  }, []);

  useEffect(() => {
    if (id) {
      fetchBlogbyId();
    }
  }, [id]);

  useEffect(() => {
    if (!token) {
      return navigate("/signin");
    }
  }, []);

  return (
    <div className="p-5 w-full  sm:w-[500px] lg:w-[1000px] mx-auto">
      <div className="lg:flex lg:justify-between gap-10">
        <div className="lg:w-3/6">
          <div className="my-4">
            <h2 className="text-2xl font-semibold my-2 ">Image</h2>
            <label htmlFor="image" className="">
              {blogData.image ? (
                <img
                  src={
                    typeof blogData.image == "string"
                      ? blogData.image
                      : URL.createObjectURL(blogData.image)
                  }
                  alt=""
                  className="aspect-video object-contain"
                />
              ) : (
                <div className="bg-white border rounded-lg opacity-50 aspect-video flex justify-center items-center text-4xl">
                  Select Image
                </div>
              )}
            </label>
            <input
              className="hidden"
              id="image"
              type="file"
              accept=".png, jpeg, .jpg"
              onChange={(e) =>
                setBlogData((prev) => ({ ...prev, image: e.target.files[0] }))
              }
            />
          </div>
        </div>
        <div className="lg:w-3/6">
          <div className="my-4">
            <h2 className="text-2xl font-semibold my-2 ">Title</h2>
            <input
              type="text"
              placeholder="title"
              onChange={(e) =>
                setBlogData((prev) => ({ ...prev, title: e.target.value }))
              }
              value={blogData.title}
              className=" border focus:outline-none rounded-lg p-2 w-1/2 placeholder:text-lg placeholder:opacity-95"
            />
          </div>
          <div className="my-4">
            <h2 className="text-2xl font-semibold my-2 ">Tags</h2>
            <input
              type="text"
              placeholder="tags"
              className="w-full border text-lg focus:outline-none rounded-lg p-2"
              onKeyDown={handleKeyDown}
            />
            <div className="flex justify-between my-2">
              <p className="text-xs opacity-60 my-1">
                *Click on Enter to add Tags
              </p>
              <p className="text-xs opacity-60 my-1">
                {10 - blogData.tags.length} Tags remaining
              </p>
            </div>
            <div className="flex flex-wrap">
              {blogData?.tags?.map((tag, index) => (
                <div
                  key={index}
                  className="m-2 bg-gray-200 text-black rounded-full px-7 py-2 gap-3 flex justify-center items-center hover:text-white hover:bg-blue-600"
                >
                  <p className="f">{tag}</p>
                  <i
                    className="fi fi-sr-cross-circle mt-1 text-xl cursor-pointer "
                    onClick={() => deleteTag(index)}
                  ></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="my-4">
        <h2 className="text-2xl font-semibold my-2 ">Description</h2>
        <textarea
          type="text"
          placeholder="description"
          onChange={(e) =>
            setBlogData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          value={blogData.description}
          className=" h-[100px] resize-none w-full border text-lg focus:outline-none rounded-lg p-3"
        />
      </div>
      <div className="my-4">
        <h2 className="text-2xl font-semibold my-2 ">Draft</h2>
        <select
          name=""
          id=""
          className="w-full border text-lg focus:outline-none rounded-lg p-2"
          value={blogData.draft}
          onChange={(e) =>
            setBlogData((prev) => ({
              ...prev,
              draft: e.target.value == "true" ? true : false,
            }))
          }
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>

      <div className="my-4">
        <h2 className="text-2xl font-semibold my-2 ">Content</h2>
        <div id="editorjs" className="w-full"></div>
      </div>

      <button
        className="bg-blue-500 text-lg py-4 px-7 rounded-full font-semibold text-white my-6"
        onClick={id ? handleUpdateBlog : handlePostBlog}
      >
        {blogData.draft ? "Saved as Draft" : id ? "Update Blog" : "Post Blog"}
      </button>
    </div>
  );
}

export default AddBlog;
