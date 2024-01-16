"use client"
import React from "react";
import { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
import axios from "axios";


const page = () => {

  const [data, setData] = useState({ name: '', desc: '' })
  const [tasks, setTasks] = useState([])
  // console.log(data)

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (data.name && data.desc) {
      try {
        const response = await axios.post("http://localhost:8000/api/v1/task/add-task", { data })
        if (response.data.success) {
          toast.success("Task Added!")
          setData({ name: '', desc: '' })
          setTasks(response.data.allTasks)
          // window.location.reload();
        }
      } catch (error) {
        toast.error(error?.response?.data.message)
      }
    } else {
      toast.error("All Fields are Mandatory")
    }
  }

  async function deleteTask(id) {
    try {
      const response = await axios.delete(`http://localhost:8000/api/v1/task/delete-task?id=${id}`);
      if (response.data.success) {
        toast.success(response.data.message)
        setTasks(response.data.updatedTasks)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  async function TaskComplete(id) {
    try {
      const response = await axios.patch(`http://localhost:8000/api/v1/task/completed-task?id=${id}`)

      if (response.data.success) {
        toast.success(response.data.message)
        setTasks(response.data.taskCompleted)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  async function getTasks() {
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/task/get-all-task")
      if (data.success) {
        // console.log(data.tasks)
        setTasks(data.tasks)
      }

    } catch (error) {
      toast.error(error?.data?.message)
    }
  }

  useEffect(() => {
    //fetch all tasks
    getTasks()

  }, [])

  return (
    <div className="App">
      <div className="screenN">
        <h2 className="header">My TodoS</h2>
        <div className='top'>

          <form className='top-left' onSubmit={handleSubmit}>
            <div className="top-left1">
              <div>
                <label>Name</label><br />
                <input className='namee' type='text' name='name' value={data.name} onChange={handleChange} />
              </div>
              <div>
                <label>Decription</label><br />
                <input  className='descc' type='text' name='desc' value={data.desc} onChange={handleChange} />
              </div>
            </div>

            <div className='submit-div'>
              <input type='submit' value='Add Todo' />
            </div>

          </form>
        </div>

        <div className='bottom'>
          {tasks.length ?
            <div className='display'>
              {tasks.map((pro, i) => (
                <>
                  {pro.completed &&
                    <button className='delete' onClick={() => deleteTask(`${pro._id}`)} >Delete</button>
                  }
                  <div key={i} className='singleDiv'>
                    <div className='task-info'>
                      <h2 className={pro.completed ? 'completed task-name ' : 'not task-name'}>{pro.name}</h2>
                      <p className={pro.completed ? 'completed task-desc ' : 'not task-desc'}>{pro.desc}</p>
                    </div>
                    < button className={pro.completed ? 'completed completed-btn ' : 'not completed-btn'} onClick={() => TaskComplete(`${pro._id}`)}> Completed? </button>
                  </div >

                </>
              ))}

            </div>
            :
            <div>Loading</div>
          }
        </div>

      </div >
    </div >
  )
}


export default page