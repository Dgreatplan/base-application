import moment from "moment";

export default {
  methods: {
    isValidUrl(url) {
      const regex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
      return regex.test(url);
    },
    ruleSetter(keys) {
      let rules = {};
      (keys || []).forEach(key => {
        Object.assign(rules, {
          [key]: [{
            required: true,
            message: "This field is required",
            trigger: "change"
          }]
        })
      });
      return rules;
    },
    /**
     * @description remove array duplication
     * @param {string} array
     * @param {string} field1
     * @param {string} field2
     * @returns {string} array of objects
    */
    removeArrayElementDuplication(array, field1, field2) {
      return array.filter((value, index, self) => {
        return index === self.findIndex((t) => (
          t[field1] === value[field1] && t[field2] === value[field2]
        ));
      });
    },

    isImageFile(file) {
      let imageExt = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
        "image/svg+xml",
      ];
      return imageExt.includes(file.type);
    },

    /**
     * @description sort array of time
     * @param {String} arr
    */
    sortTime(arr) {
      return arr.sort((a, b) =>
        (a.timeIn < b.timeIn)
          ? -1
          : (a.timeIn > b.timeIn)
            ? 1 : 0
      );
    },
    
    getMonthsList() {
      return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    },

    notify(type, description, icon, icon_color) {
      let types = ["success", "info", "warning", "warn", "error"];
      types.forEach((record) =>
        type === record
          ? this.$notification[record]({
            message: this.ucwords(type),
            description,
          })
          : {}
      );
    },

    setTableResponsive({cols, breakpoints, columns, dataSource}) {
      let attrs = { columns, dataSource };
      columns.forEach((column) => {
        if(this.$breakpoints[breakpoints]) {
          const _col = cols.find((col) => col === column.key);
          if(_col) column.width = 250;
          else column.width = 180;

          attrs.scroll = { x: 500 };
        } else {
          delete attrs.scroll;
          delete column.width;
        }
      });
      return attrs;
    },

    catchError(error, message = "Error") {

      const status = error?.response?.status || null;

      if(this.$auth.loggedIn && status == 401) {
        console.log("API error :>> ", error?.response);
      } else {
        const err = error?.response?.data?.message;
        const description = err ?? "Unknown error ocured. Please contact administrator.";

        this.$notification.error({ message, description });
      }
    },

    getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for(let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },

    getStatusColor(status) {
      return status === 'Active' ? 'green' : 'red';
    },

    getOrdinal(number) {
      let num = number.toString().at(-1);
      for(let i = 0; i < 9; i++) {
        let _num = parseInt(num);
        if(_num === 1) return number + "st";
        else if(_num === 2) return number + "nd";
        else if(_num === 3) return number + "rd";
        else return number + "th";
      }
    },

    /**
     * @description date formatter
     * @param {Date} date
     * @param {String} type [datetime, time, time24, date]
     */
    formatDate(date, type) {
      if (!date) return date;
      var dt = new Date(date);

      if (!type) {
        type = {
          year: "numeric",
          month: "long",
          day: "2-digit",
        };
      } else if (type === "datetime") {
        type = {
          hour12: true,
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };
      } else if (type === "time") {
        type = {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };
      } else if (type === "timeWithoutSec") {
        type = {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
        };
      } else if (type === "time24") {
        type = {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };
      } else if (type === "YYYY-MM-DD") {
        type = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        };
      } else if (type === "MM-DD") {
        type = {
          month: "2-digit",
          day: "2-digit",
        };
      } else if (type === "long-DD") {
        type = {
          month: "long",
          day: "2-digit",
        };
        // return dt.toLocaleString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
      }
      return dt.toLocaleString("en-US", type);
    },
    formatTime(time) {
      if (!time) return time;
      return moment(time, "HH:mm:ss").format("hh:mm:ss A");
    },

    /**
     * @description find month string
     */
    getStringDate(month) {
      let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return months.find((item, index) => {
        return index === month && item;
      });
    },

    /**
     * @description remove the html elements
     */
    strippedContent(string) {
      return string.toString().replace(/<\/?[^>]+>/gi, " ");
    },

    /**
     * @description create new copy of object
     */
    deepCopy(object) {
      return JSON.parse(JSON.stringify(object));
    },

    /**
     * @description get file extension
     * @param {*} attachment
     */
    getFileExt(attachment) {
      return attachment.url.split(".").reverse()[0];
    },

    /**
     * @description get uppercase per word
     * @param {*} word
     */
    ucwords(word) {
      if (!word) return word;
      let names = word.split(" "); // Split by space
      let capitalized_name = names
        .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
        .join(" "); // Uppercase the first letter then Join again by space
      return capitalized_name;
    },

    /**
     * @description add an audit trail
     * @param {*} activity
     */
    async log(activity) {
      await this.$axios.post("/audit-logs", activity);
    },

    /**
     * @description get duration of 2 dates
     * @param {*} time1
     * @param {*} time2
     * @param {*} as
     */
    computeHoursDuration(time1, time2, as = "asHours") {
      return moment
        .duration(
          moment(time2, "HH:mm:ss").diff(moment(time1 ? time1 : 0, "HH:mm:ss"))
        )
      [as]();
    },

    disableFutureDate(current) {
      return current && current > this.$moment().endOf("day");
    },

    disablePastDate(current) {
      return current < this.$moment().startOf("day");
    },

    enabledSpecificDate(current) {
      const today = new Date();
      const fiveDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
      const currentAsDate = new Date(current);
      const withinFiveDays = currentAsDate >= fiveDaysAgo;

      const isHoliday = this.holidays.some((holiday) => {
        const holidayDate = new Date(holiday.date);
        return (
          holidayDate.getFullYear() === currentAsDate.getFullYear() &&
          holidayDate.getMonth() === currentAsDate.getMonth() &&
          holidayDate.getDate() === currentAsDate.getDate()
        );
      });

      if (withinFiveDays && !isHoliday) {
        return false;
      } else {
        return true;
      }
    },

    disableHolidayDates(date) {
      const currentDate = new Date(date);
      return this.holidays.some((holiday) => {
        const holidayDate = new Date(holiday.date);
        return (
          holidayDate.getFullYear() === currentDate.getFullYear() &&
          holidayDate.getMonth() === currentDate.getMonth() &&
          holidayDate.getDate() === currentDate.getDate()
        );
      });
    },

    disablePastWeek(current) {
      const currentDate = new Date(current);
      const today = new Date();
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + 5);
      const isPastWeekDate = currentDate < today || currentDate <= endOfWeek;
      const isHoliday = this.holidays.some((holiday) => {
        const holidayDate = new Date(holiday.date);
        return (
          holidayDate.getFullYear() === currentDate.getFullYear() &&
          holidayDate.getMonth() === currentDate.getMonth() &&
          holidayDate.getDate() === currentDate.getDate()
        );
      });
      return isPastWeekDate || isHoliday;
    },
  },
};
