const HeaderSelect = ({ className }: { className: string }) => {

    return (
        <select className={`bg-white text-black border border-gray-300 rounded-md p-2 ${className}`}>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
        </select>
    );

};

export default HeaderSelect;