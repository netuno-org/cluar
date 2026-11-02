import { Select } from "antd";
import {
  LuHouse,
  LuUser,
  LuUsers,
  LuSettings,
  LuBell,
  LuCalendar,
  LuClock,
  LuChartBar,
  LuChartLine,
  LuFolder,
  LuFile,
  LuFileText,
  LuSearch,
  LuStar,
  LuHeart,
  LuBookmark,
  LuMail,
  LuMessageCircle,
  LuPhone,
  LuCamera,
  LuImage,
  LuDownload,
  LuUpload,
  LuTrash2,
  LuPencil,
  LuPlus,
  LuMinus,
  LuCheck,
  LuX,
  LuMenu,
} from "react-icons/lu";

const icons = {
  home: LuHouse,
  user: LuUser,
  users: LuUsers,
  settings: LuSettings,
  notification: LuBell,
  calendar: LuCalendar,
  clock: LuClock,
  chart: LuChartBar,
  chartLine: LuChartLine,
  folder: LuFolder,
  file: LuFile,
  fileText: LuFileText,
  search: LuSearch,
  star: LuStar,
  heart: LuHeart,
  bookmark: LuBookmark,
  mail: LuMail,
  message: LuMessageCircle,
  phone: LuPhone,
  camera: LuCamera,
  image: LuImage,
  download: LuDownload,
  upload: LuUpload,
  delete: LuTrash2,
  edit: LuPencil,
  add: LuPlus,
  remove: LuMinus,
  check: LuCheck,
  close: LuX,
  menu: LuMenu,
};

const iconOptions = Object.entries(icons).map(([key, Component]) => ({
  value: key,
  label: (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Component size={16} />
      <span>{key}</span>
    </div>
  ),
}));

export function Icon({ name, ...props }) {
  const Component = icons[name];

  if (!Component) return null;

  return <Component {...props} />;
}

export function IconSelect({ value, onChange, ...props }) {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={iconOptions}
      optionRender={(option) => option.label}
      placeholder="Selecione um ícone"
      style={{ width: "100%" }}
      showSearch
      optionFilterProp="value"
      {...props}
    />
  );
}
