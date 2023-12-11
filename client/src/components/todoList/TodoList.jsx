import React, { useEffect, useState } from 'react'
import axios from "axios"
export default function TodoList() {
    const [newTodo, setNewTodo] = useState({
        name: "",
    })
    const [allTodo, setAllTodo] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [flag, setFlag] = useState(false)
    
    const handleGetAllTodo = async () => {
        try {

            const res = await axios.get("http://localhost:7800/api/v1/todo?per_page=4")
            // console.log(res);
            setAllTodo(res.data)
        }
        catch (error) {
            console.log("error")
        }
    }
    
    useEffect(() => {
        handleGetAllTodo()
    }, [flag])

    const handleGetInput = (e) => {
        setNewTodo({ ...newTodo, [e.target.name]: e.target.value })
    }
    const handleAdd = async () => {
        if (newTodo.name=="") {
            return
        }else{
            try {
                if (!isEditing) {
                    const res = await axios.post("http://localhost:7800/api/v1/todo", {
                        ...newTodo,
                        completed: false,
                        id: Math.floor(Math.random() * 999999)
                    })
                    setNewTodo({ name: "", })
                    setFlag(!flag)
                }
                else {
                    const response = await axios.put(
                        `http://localhost:7800/api/v1/todo/${newTodo.id}`,
                        newTodo
                    );
                    setAllTodo(response.data.todo);
                    setNewTodo({ name: "" });
                    setIsEditing(false);
                    setFlag(!flag)
                }
            }
            catch (error) {
                console.log(error)
            }
        }
        
    }

    const handleEdit = ((item) => (
        setNewTodo(item),
        setIsEditing(true)
    ))
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:7800/api/v1/todo/${id}`);
            // console.log(res.data.todo);
            setFlag(!flag)
        }
        catch (error) {
            console.log("error")
        }
    }

    const handleDeleteAll = async () => {
        try {
            const response = await axios.delete(`http://localhost:7800/api/v1/todo`);
            // setAllTodo(response.data.todo);
            setFlag(!flag)
        } catch (error) {
            console.log(error);
        }
    };

    const handleComplete = async (item) => {
        // console.log(item);
        try {
            const res = await axios.patch(`http://localhost:7800/api/v1/todo/completed/${item.id}`)
            // setAllTodo(res.data.todoList)
            setFlag(!flag)
            // console.log(res);
        }
        catch (error) {
            console.log(error)
        }
    }

    const allTodoLength= allTodo.filter((item)=>item.completed==false)



    return (
        <div className=" h-[750px] w-[100%] flex bg-gradient-to-b from-custom-200 to-custom-100">
            <div className=" bg-custom-50 w-[25%] m-auto h-[650px] items-center rounded-lg ">
                <div className="h-[70px] flex items-center w-[90%] m-auto">
                    <h1 className="text-3xl font-bold">Todo App</h1>
                </div>
                <div className="w-[90%] m-auto flex">
                    <input
                        type="text"
                        className="w-[300px] h-[50px] block mr-3 pl-5"
                        placeholder="ADD YOUR NEW TODO"
                        name="name"
                        onChange={handleGetInput}
                        value={newTodo.name}

                    />
                    <button onClick={handleAdd}
                        className="bg-custom-100 w-[50px] h-[50px] rounded block"
                    >
                        {isEditing ? (
                            <i className="fa-solid fa-floppy-disk"></i>
                        ) : (
                            <i className="fa-solid fa-plus text-white"></i>

                        )
                        }
                    </button>
                </div>

                {allTodo?.map((item, index) => (
                    <div
                        className="mt-5 w-[90%] m-auto text-2xl font-bold bg-zinc-300 h-[50px] flex items-center justify-between" key={index}
                    >
                        <p 
                        onClick={() => handleComplete(item)} 
                        style={{ textDecoration: item.completed ? "line-through" : "" }} className="ml-5">
                        {item.name}
                        </p>
                        <div>
                            <button onClick={() => handleEdit(item)}
                                className="bg-red-500 h-[50px] w-[50px] rounded"
                            >
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>{" "}
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-500 h-[50px] w-[50px] rounded"

                            >
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>

                ))}



                <div className="flex justify-between w-[90%] m-auto pt-5">
                    <p className=" text-xl flex items-center">
                        You have {allTodoLength?.length}  pending task
                    </p>
                    <button
                        onClick={handleDeleteAll}
                        className="block rounded bg-red-500 w-[50px] h-[50px]"

                    >
                        <i className="fa-solid fa-x"></i>
                    </button>
                </div>
            </div>
        </div>

    )

}
