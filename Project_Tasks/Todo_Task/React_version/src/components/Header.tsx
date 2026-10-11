import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between border-b p-2 shadow">
        <div className="flex items-center gap-4">
            <a href="#">TodoList</a>
            <ul className="flex gap-2">
                <li className="text-gray-950 hover:scale-110 duration-75">Tasks</li>
                <li className="text-gray-500 hover:text-gray-950 hover:scale-110 duration-75">Users</li>
            </ul>
        </div>
        <Button >Add Task</Button>
    </header>
  );
};

export default Header;
