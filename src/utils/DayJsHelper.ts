import dayjs from "dayjs";
import "dayjs/locale/ko.js"
dayjs.locale('ko')

export const DATE_FORMAT = "YYYY. MM. DD. HH:mm:ss"
export const DATE_FORMAT_KOR = "YY년 MM월 DD일 HH시 mm 분"
export const DATE_FORMAT_SIMPLE_KOR = "YY.MM.DD HH:mm"

/**
 * 두 날짜를 비교하는 함수
 * @param dateString1
 * @param dateString2
 * @return number -1 dateString1 이 이전 1 dateString 이 이후, 같음
 */
export const compareDates = (dateString1:string, dateString2:string) => {
    const date1 = dayjs(dateString1, DATE_FORMAT);
    const date2 = dayjs(dateString2, DATE_FORMAT);

    if (date1.isBefore(date2)) {
        return -1;
    } else if (date1.isAfter(date2)) {
        return 1;
    } else {
        return 0;
    }
};
export function createTodayDate():string{
    const currentDate = dayjs();
    return currentDate.format(DATE_FORMAT);
}

export function getToday():dayjs.Dayjs{
    return dayjs();
}
export function reformatTime(dbDate:string):string{
    const dateObject = dayjs(dbDate);
    return dateObject.format(DATE_FORMAT_SIMPLE_KOR)

}
export function calcTimeDiff(dbDate:string):string{
    const currentDate = dayjs(); // 현재 날짜를 가져옵니다.
    const storedDateFromDB = dayjs(dbDate);

    const secondsDifference = currentDate.diff(storedDateFromDB, 'second');
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(secondsDifference / (60 * 60));
    const daysDifference = Math.floor(secondsDifference / (60 * 60 * 24));
    const monthsDifference = Math.floor(secondsDifference / (60 * 60 * 24 * 30));
    const yearsDifference = Math.floor(secondsDifference / (60 * 60 * 24 * 365));

    if (secondsDifference < 30) {
        return "방금전"
    }
    else if (secondsDifference < 60) {
        return `${secondsDifference}초 전`;
    } else if (minutesDifference < 60) {
        return `${minutesDifference}분 전`;
    } else if (hoursDifference < 24) {
        return `${hoursDifference}시간 전`;
    } else if (daysDifference < 30) {
        return `${daysDifference}일 전`;
    } else if (monthsDifference < 12) {
        return `${monthsDifference}개월 전`;
    } else {
        return `${yearsDifference}년 전`;
    }
}