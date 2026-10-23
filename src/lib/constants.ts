//url 주소
export const API_URL = import.meta.env.VITE_API_URL;
export const DOMAIN_URL = import.meta.env.VITE_DOMAIN_URL;

//세션 스토리지 키
export const VERIFICATION_EMAIL = "verificationEmail";
export const SCROLL_RESET_KEY = "scroll-reset";

//로컬 스토리지 키
export const SELECTED_KID_KEY = "bookmate-selected-kid";
export const SELECTED_CLASSROOM_KEY = "selectedClassroomId";
export const SELECTED_CHART_CLASSROOM_KEY = "selectedChartClassroomId";

//차트 관련 기본 값
export const INFO_HEIGHT = 64;
export const STICKER_SIZE = 40;
export const DEFAULT_GAP = 8;
export const DEFALUT_CHART_SCALE = 30; //10단위로

//이메일 정규식
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//무한스크롤 감지 기준
export const INFINITE_SCROLL_ROOT_MARGIN = "500px";
