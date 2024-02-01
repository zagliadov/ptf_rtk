import axios, { AxiosError } from "axios";

const MAX_TOTAL_RECORDS = 500;
const MAX_RETRIES = 1;
const MAX_SKIP = 2000;

const fetchCustomData = async (source: any) => {
  let page = 1;
  let allData: any = [];
  let continueFetching = true;

  while (continueFetching) {
    const skip = MAX_TOTAL_RECORDS * (page - 1);

    if (skip >= MAX_SKIP) {
      break;
    }

    const urlParams = new URLSearchParams({ skip: skip.toString() });
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        const response = await axios.get(
          `https://compass.apexdigital.online/secure/api/v2/90539/21010A68F2704355A624B6D0CE776A2D/${source.tableName}/${source.viewName}/select.json?${urlParams}`
        );
        const data = response.data;

        if (data && data.length > 0) {
          allData = [...allData, ...data];
          page += 1;
          break;
        } else {
          continueFetching = false;
          break;
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 500) {
          retries += 1;
          if (retries >= MAX_RETRIES) {
            throw new Error("Превышено максимальное количество попыток");
          }
        } else {
          throw error;
        }
      }
    }
  }

  return allData;
};

export default fetchCustomData;























// import axios, { AxiosError } from "axios";

// const MAX_TOTAL_RECORDS = 500;
// const MAX_RETRIES = 2; // Максимальное количество попыток повтора запроса

// const fetchCustomData = async (source: any) => {
//   let page = 1;
//   let allData: any = [];
//   let continueFetching = true;

//   while (continueFetching) {
//     const skip = MAX_TOTAL_RECORDS * (page - 1);
//     const urlParams = new URLSearchParams({ skip: skip.toString() });
//     let retries = 0;

//     while (retries < MAX_RETRIES) {
//       try {
//         const response = await axios.get(
//           `https://compass.apexdigital.online/secure/api/v2/90539/21010A68F2704355A624B6D0CE776A2D/${source.tableName}/${source.viewName}/select.json?${urlParams}`
//         );
//         const data = response.data;

//         if (data && data.length > 0) {
//           allData = [...allData, ...data];
//           page += 1;
//           break; // Выход из внутреннего цикла повторов
//         } else {
//           continueFetching = false;
//           break; // Выход из внутреннего цикла повторов, если данные пусты
//         }
//       } catch (error) {
//         if (error instanceof AxiosError && error.response?.status === 500) {
//           retries += 1; // Увеличиваем счетчик попыток
//           if (retries >= MAX_RETRIES) {
//             throw new Error("Превышено максимальное количество попыток");
//           }
//         } else {
//           throw error; // Другие ошибки перебрасываем дальше
//         }
//       }
//     }
//   }

//   return allData;
// };

// export default fetchCustomData;
