const express = require("express")
const fs = require("fs");
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// lấy dữ liệu từ db.json
const rawData = fs.readFileSync("db.json")
const data = JSON.parse(rawData)

// tạo Router
// lấy toàn bộ todo
app.get("/api/v1/todo", (req, res) => {
   
    // console.log("đã chạy vào router");
    const {per_page}= req.query
    // console.log(per_page);
    const result = data.todoList.slice(0,per_page)
    res.status(200).json(
        result
    )

})

// Router them todo 
app.post("/api/v1/todo", (req, res) => {
    // console.log("đã chạy vào router");
    data.todoList.unshift(req.body);
    fs.writeFileSync("db.json", JSON.stringify(data));
    res.status(200).json({
        message: "đã thêm thành công",
        todo: data.todoList
    })

})
// Router edit
app.put("/api/v1/todo/:id", (req, res) => {
    const { id } = req.params
    const index = data.todoList.findIndex((item) => item.id == id)
    // console.log(req.body);
    data.todoList[index] = req.body
    fs.writeFileSync("db.json", JSON.stringify(data))
    res.status(200).json({
        message: "sua thanh cong",
        todo: data.todoList
    })
})

// Router delete
app.delete("/api/v1/todo/:id", (req, res) => {
    const { id } = req.params
    const arrAfterFilter = data.todoList.filter((item) => item.id != id);
    data.todoList = arrAfterFilter
    fs.writeFileSync("db.json", JSON.stringify(data))
    res.status(200).json({
        message: "xoa thanh cong",
        todo: data.todoList
    })

})

app.delete("/api/v1/todo/", (req, res) => {
    data.todoList = [];
    fs.writeFileSync("db.json", JSON.stringify(data));
    res.status(201).json(data.todoList);
});
console.log(data);
//router complete
app.patch("/api/v1/todo/completed/:id", (req, res) => {
    const { id } = req.params;
    console.log(id);
    console.log(data.todoList);
    const index = data.todoList.findIndex((item) => item.id == id);
    console.log(data.todoList[index]);
    data.todoList[index].completed = !data.todoList[index].completed;
    fs.writeFileSync("db.json", JSON.stringify(data));
    res.status(200).json(data);
  });



// Tạo  cổng chạy server
app.listen(7800, () => {
    console.log("Server is running on port 7800")
})