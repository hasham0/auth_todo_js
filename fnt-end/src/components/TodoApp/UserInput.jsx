import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Fields from "./Fields";
import List from "./List";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export default function UserInput() {
  const navigate = useNavigate();

  // get user id from search params
  const [searchParams, setSearchParams] = useSearchParams();
  //  all todos
  const [list, setList] = useState([]);
  // edit id
  const [editID, setEditID] = useState();
  // update
  const [updateBtn, setUpdateBtn] = useState(false);

  const [userInputs, setUserInputs] = useState({
    task: "",
    status: false,
  });

  // initial input states
  const initialState = () =>
    setUserInputs({
      task: "",
      status: false,
    });

  //fetching todos form node server / database
  const getAllTodos = async () => {
    const responce = await fetch(
      `http://localhost:8000/allTodos?user_id=${searchParams.get("userID")}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const responceData = await responce.json();
    setList(responceData.data);
  };

  // creating new todo
  const getData = async (userData) => {
    if (!searchParams.get("userID")) return toast.error("Please login first");
    console.log(userData);
    const todoData = {
      ...userData,
      user_id: searchParams.get("userID"),
    };
    const responce = await fetch("http://localhost:8000/newTodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoData),
    });
    const responceData = await responce.json();
    const { data } = responceData;
    const copyList = list.slice();
    copyList.push(data);
    setList(copyList);
    initialState();
    toast.success(responceData.message);
  };

  // clear all in fiels and LS
  const handleClearAll = async () => {
    const responce = await fetch("http://localhost:8000/clear", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responceData = await responce.json();
    setList(responceData.data);
    toast.success(responceData.message);
  };

  // handle Edit
  const handleEdit = (id) => {
    let listClone = list.slice();
    const match = listClone.findIndex((item) => item._id === id);
    setUpdateBtn(true);
    setEditID(id);
    setUserInputs({
      task: listClone[match].task,
      status: listClone[match].status,
    });
  };

  //handle Reset
  const handleReset = () => initialState();

  // handle delete
  const handleDelete = async (id) => {
    const responce = await fetch(`http://localhost:8000/deleteTodo/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responceData = await responce.json();
    const matchTodo = list.findIndex((item) => item._id === editID);
    let copyList = list.slice();
    copyList.splice(matchTodo, 1);
    setList(copyList);
    toast.success(responceData.message);
  };

  // handle update
  const handleUpdate = async () => {
    const responce = await fetch(`http://localhost:8000/updateTodo/${editID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInputs),
    });
    const responceData = await responce.json();
    const matchTodo = list.findIndex((item) => item._id === editID);
    let copyList = list.slice();
    copyList.splice(matchTodo, 1, responceData.data);
    setList(copyList);
    initialState();
    setUpdateBtn(false);
    toast.success(responceData.message);
  };

  // loading all existed todo in database
  useEffect(() => {
    getAllTodos();
  }, []);

  return (
    <div className="m-5 mx-auto flex w-1/2 flex-col border-2 border-black">
      <button onClick={() => navigate("/")} className="btn_Style" type="submit">
        back
      </button>
      <Fields
        getDatahandle={getData}
        handleClearAll={handleClearAll}
        updateBtn={updateBtn}
        userInputs={userInputs}
        setUserInputs={setUserInputs}
        handleUpdate={handleUpdate}
        handleReset={handleReset}
      />
      <section className="m-6 flex justify-center">
        <table className="w-full">
          <thead>
            <tr className="border-2 border-red-600 bg-gray-200 uppercase ">
              <th>id</th>
              <th>task</th>
              <th>status</th>
              <th>edit</th>
              <th>delete</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {list.map((item, index) => {
              return (
                <List
                  key={index}
                  values={item}
                  myKey={index}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
