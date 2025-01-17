import React, { useState, useEffect } from 'react';
import './App.css'; 

const BloggingPlatform = () => {
  const [blogs, setBlogs] = useState([]); 
  const [currentBlog, setCurrentBlog] = useState(''); 
  const [editingIndex, setEditingIndex] = useState(null);
  const [isListening, setIsListening] = useState(false); 

  useEffect(() => {
    const recognition = new window.webkitSpeechRecognition() || new window.SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setCurrentBlog((prev) => prev + transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.abort();
  }, [isListening]);

  const addOrEditBlog = () => {
    if (editingIndex !== null) {
      const updatedBlogs = blogs.map((blog, index) => (index === editingIndex ? currentBlog : blog));
      setBlogs(updatedBlogs);
      setEditingIndex(null);
    } else {
      setBlogs([...blogs, currentBlog]);
    }
    setCurrentBlog('');
  };

  const editBlog = (index) => {
    setCurrentBlog(blogs[index]);
    setEditingIndex(index);
  };

  const deleteBlog = (index) => {
    setBlogs(blogs.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <h1>Blogging Platform</h1>
      <textarea
        rows="5"
        placeholder="Write your blog here..."
        value={currentBlog}
        onChange={(e) => setCurrentBlog(e.target.value)}
        className="textarea"
      ></textarea>
      <div className="button-container">
        <button onClick={addOrEditBlog} className="action-button">
          {editingIndex !== null ? 'Update Blog' : 'Post Blog'}
        </button>
        <button onClick={() => setIsListening(!isListening)} className="action-button">
          {isListening ? 'Stop Voice Input' : 'Start Voice Input'}
        </button>
      </div>

      <h2>All Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs posted yet.</p>
      ) : (
        blogs.map((blog, index) => (
          <div key={index} className="blog-post">
            <p>{blog}</p>
            <div className="blog-button-container">
              <button onClick={() => editBlog(index)} className="edit-button">
                Edit
              </button>
              <button onClick={() => deleteBlog(index)} className="delete-button">
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BloggingPlatform;
