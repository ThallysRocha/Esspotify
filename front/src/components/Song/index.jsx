import "./styles.css";
import Icon from "../Icon";
const Song = ({
  name,
  duration,
  participation,
  number,
  handleDelete,
  handlePlay,
  ...props
}) => {
  return (
    <div className="Song-Wrapper" onClick={handlePlay} {...props}>
      <label className="SongNumber">{number} </label>
      <label className="SongName">{name} </label>
      <label className="Songparticipation">{participation} </label>
      <label className="SongDuration">{duration} </label>
      {handleDelete && !handlePlay ? (
        <Icon iconType="Remove" className="Remove" onClick={handleDelete} />
      ) : (
        ""
      )}
    </div>
  );
};
export default Song;
