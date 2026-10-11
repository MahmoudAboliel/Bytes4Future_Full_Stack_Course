// import PageHeader from "@/components/PageHeader";
// import Table from "@/components/Table/Table";
// import TableBody from "@/components/Table/TableBody/TableBody";
// import TableCell from "@/components/Table/TableCell/TableCell";
// import TableHead from "@/components/Table/TableHead/TableHead";
// import TableRow from "@/components/Table/TableRow/TableRow";
// import { useUser } from "@/context/UserContext";
// import { pageMeta } from "@/lib/constants";
// import type { ColumnConfig, Todo } from "@/lib/types";
// import { extractHeaders } from "@/lib/utils";
// import { todosApi } from "@/services/api";
// import { Button } from "@/components/ui/button";
// import { useEffect, useRef, useState } from "react";
// // import { Link } from "react-router";
// import { Badge } from "@/components/ui/badge";
// import { DynamicForm } from "@/lib/dynamic-form/DynamicForm";
// import { LayoutList } from "lucide-react";
// import CustomDialog, { type CustomDialogRef } from "@/components/CustomDialog";

// const Todos = () => {
//   const { user } = useUser();
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [update, setUpdate] = useState<boolean>(false);
//   useEffect(() => {
//     const fetchTodos = async () => {
//       if (user) {
//         const response = await todosApi.getAll(`?userId=${user.id}`);
//         setTodos(response?.data.reverse() || []);
//       }
//     };
//     fetchTodos();
//   }, [user, update]);
//   console.log(todos);

//   const todoColumns: ColumnConfig<Todo>[] = [
//     { header: "No.#", key: "id" },
//     { header: "Title", key: "title" },
//     { header: "Status", key: "completed" },
//   ];

//   const headers = [...extractHeaders(todoColumns), "Actions"];
//   // TODO fix TableCell to accept a true/false boolean to display status for Todos

//   const ref = useRef<CustomDialogRef>(null);

//   return (
//     <div>
//       <PageHeader
//         {...pageMeta.todos}
//         AddButton={
//           <CustomDialog
//             Trigger={
//               <Button size="sm" variant="default">
//                 <LayoutList />
//                 Add Todo
//               </Button>
//             }
//             dialogTitle="Add Todo"
//             dialogDesc="Orgnaize your plans"
//             ref={ref}
//           >
//             <DynamicForm
//               fields={[
//                 {
//                   name: "title",
//                   label: "Todo Title",
//                   type: "text",
//                   required: true,
//                 },
//               ]}
//               onSubmit={async (data: Record<string, unknown>) => {
//                 if (user) {
//                   const payload: Omit<Todo, "id"> = {
//                     title: (data.title as string) ?? "",
//                     completed: false,
//                     userId: user.id,
//                   };
//                   await todosApi.create(payload);
//                   setUpdate((prev) => !prev);
//                   ref.current?.close();
//                 }
//               }}
//               submitLabel="Add"
//               columns={1}
//             />
//           </CustomDialog>
//         }
//       />
//       <Table id="table">
//         <TableHead cols={headers} />
//         <TableBody id="table-body">
//           {todos.map((todo, index) => (
//             <TableRow key={todo.id}>
//               {todoColumns.map((col) => (
//                 <TableCell key={col.key} id={String(col.key)}>
//                   {col.key === "id" ? (
//                     index + 1
//                   ) : col.key === "completed" ? (
//                     <Badge
//                       variant={"outline"}
//                       className={`${todo.completed ? "bg-green-300/20 text-green-500" : "bg-red-300/20 text-red-500"}`}
//                     >
//                       {todo.completed ? "Completed" : "Uncompleted"}
//                     </Badge>
//                   ) : (
//                     String(todo[col.key])
//                   )}
//                 </TableCell>
//               ))}
//               <TableCell id="actions" className="flex items-center gap-2">
//                 <CustomDialog
//                   Trigger={
//                     <Button size="xs" variant="secondary">
//                       Update
//                     </Button>
//                   }
//                   dialogTitle="Update Todo"
//                   dialogDesc="Edit your Task"
//                   ref={ref}
//                 >
//                   <DynamicForm
//                     fields={[
//                       {
//                         name: "title",
//                         label: "Todo Title",
//                         type: "text",
//                         required: false,
//                       },
//                       {
//                         name: "completed",
//                         label: "Todo Status",
//                         type: "switch",
//                         description:
//                           "Toggle to mark as completed or uncompleted",
//                         required: false,
//                       },
//                     ]}
//                     defaultValues={{
//                       title: todo.title,
//                       completed: todo.completed,
//                     }}
//                     onSubmit={async (data: Record<string, unknown>) => {
//                       await todosApi.update(todo.id, data);
//                       setUpdate((prev) => !prev);
//                       ref.current?.close();
//                     }}
//                     submitLabel="edit"
//                     columns={1}
//                   />
//                 </CustomDialog>
//                 <Button
//                   size="xs"
//                   variant="destructive"
//                   onClick={async () => {
//                     await todosApi.delete(todo.id);
//                     setUpdate((prev) => !prev);
//                   }}
//                 >
//                   Delete
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default Todos;
