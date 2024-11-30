import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tooltip } from "@mui/material";

const SortableItem = ({ id, link, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <Tooltip
            placement="top"
            arrow
            title={
                <button
                    className="remove-link-button"
                    onClick={() => onRemove(id)}
                >
                    🗑️
                </button>
            }
        >
            <div
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                className="link-item"
                style={style}
            >
                <a
                    className="favorite-link"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={link.icon}
                        alt={link.name}
                    />
                    {link.name}
                </a>
            </div>
        </Tooltip>
    );
};

export default SortableItem;
