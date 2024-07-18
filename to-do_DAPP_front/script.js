const contractAddress = "0x5f275bf9BE15C7C5c47dd825B60ed491463Ea7aC";

const abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_content",
        type: "string",
      },
    ],
    name: "createTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "completed",
        type: "bool",
      },
    ],
    name: "TaskCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "content",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "completed",
        type: "bool",
      },
    ],
    name: "TaskCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "toggleCompleted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "taskCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tasks",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "content",
        type: "string",
      },
      {
        internalType: "bool",
        name: "completed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const web3 = new Web3("http://127.0.0.1:8545");

const todoContract = new web3.eth.Contract(abi, contractAddress);

function createTask() {
  const taskContent = document.getElementById("taskInput").value;
  if (taskContent.trim() !== "") {
    todoContract.methods
      .createTask(taskContent)
      .send({
        from: "0xa0E59802C4Eaf1Da9B919fa05224F53307234b2C",
        gas: 3000000,
      })
      .on("receipt", () => {
        updateTaskTable();
      });
  }
}

function toggleTaskCompleted(taskId) {
  todoContract.methods
    .toggleCompleted(taskId)
    .send({ from: "0xa0E59802C4Eaf1Da9B919fa05224F53307234b2C", gas: 3000000 })
    .on("receipt", () => {
      updateTaskTable();
    });
}

async function updateTaskTable() {
  const taskTable = document.getElementById("taskTable");
  taskTable.innerHTML =
    "<tr><th>ID</th><th>Task</th><th>Status</th><th>Action</th></tr>";

  const taskCount = await todoContract.methods.taskCount().call();
  for (let i = 1; i <= taskCount; i++) {
    const task = await todoContract.methods.tasks(i).call();
    const row = `
            <tr>
                <td>${task.id}</td>
                <td>${task.content}</td>
                <td>${task.completed ? "Completed" : "Pending"}</td>
                <td>
                    <button onclick="toggleTaskCompleted(${task.id})">${
      task.completed ? "Undo" : "Complete"
    }</button>
                </td>
            </tr>`;
    taskTable.innerHTML += row;
  }
}

window.onload = () => {
  updateTaskTable();
};
