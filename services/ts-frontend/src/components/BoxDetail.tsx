import React, { useEffect, useState } from "react";
import { FaEye, FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import BoxCoord from "./BoxCoord";
import BoxEditForm from "./BoxEditForm";
import Label from "./Label";
import LabelEditForm from "./LabelEditForm";
import { BoxType } from "../App";

interface BoxDetailProps {
  boxIsDrawn: boolean;
  editMode: boolean;
  box: BoxType;
  onInputChange(coords: BoxType): void;
  onEyeIconClick(coords: BoxType): void;
  onCheckIconClick(coords: BoxType): void;
  onTrashIconClick(id: number): void;
}

interface BoxDetailStates {
  boxIsDrawn: boolean;
  editMode: boolean;
  coords: BoxType;
}

function BoxDetail(props: BoxDetailProps) {
  const [boxIsDrawn, setBoxIsDrawn] = useState<boolean>(props.boxIsDrawn);
  const [editMode, setEditMode] = useState<boolean>(props.editMode || false);
  const [coords, setCoords] = useState<BoxType>({
    id: props.box.id,
    label: props.box.label,
    x_min: Math.floor(props.box.x_min),
    y_min: Math.floor(props.box.y_min),
    x_max: Math.floor(props.box.x_max),
    y_max: Math.floor(props.box.y_max),
  });

  useEffect(() => {
    setCoords({
      id: props.box.id,
      label: props.box.label,
      x_min: Math.floor(props.box.x_min),
      y_min: Math.floor(props.box.y_min),
      x_max: Math.floor(props.box.x_max),
      y_max: Math.floor(props.box.y_max),
    });
  }, [props.box]);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const { onInputChange } = props;
    const newCoords = {
      ...coords,
      [name]: name === "label" ? value : parseFloat(value) || 0,
    };
    onInputChange(newCoords);
  };

  const handleEyeIconClick = () => {
    const { box, onEyeIconClick } = props;
    setBoxIsDrawn(!boxIsDrawn);

    onEyeIconClick(box);
  };

  const handleCheckIconClick = () => {
    const { onCheckIconClick } = props;
    toggleEditMode();
    onCheckIconClick(coords);
  };

  const handleTrashIconClick = () => {
    const { onTrashIconClick } = props;
    onTrashIconClick(coords.id);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const { box } = props;

  return (
    <div className="segment" key={box.id}>
      <div className="grid">
        <div className="grid-row space-vertical">
          <div className="flex-center space-around">
            <div>
              {editMode ? (
                <LabelEditForm
                  label={box.label}
                  onInputChange={handleInputChange}
                />
              ) : (
                <Label label={box.label} />
              )}
            </div>
            <div>
              <span>
                <button
                  className={`circular ${boxIsDrawn ? "primary" : ""} button`}
                  onClick={handleEyeIconClick}
                >
                  <FaEye />
                </button>
                {editMode ? (
                  <button
                    className="circular primary button"
                    onClick={handleCheckIconClick}
                  >
                    <FaCheck />
                  </button>
                ) : (
                  <button
                    className="circular red button"
                    onClick={toggleEditMode}
                  >
                    <FaEdit color="white" />
                  </button>
                )}
                <button
                  className="circular red button"
                  onClick={handleTrashIconClick}
                >
                  <FaTrash color="white" />
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className="grid-row space-vertical">
          {editMode ? (
            <BoxEditForm coords={coords} onInputChange={handleInputChange} />
          ) : (
            <BoxCoord coords={coords} />
          )}
        </div>
      </div>
    </div>
  );
}

export default BoxDetail;
