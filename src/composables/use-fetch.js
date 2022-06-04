import { toRefs, reactive } from "vue";
export default function (url) {
  const state = reactive({
    response: [],
    error: null,
    fetching: true,
  });

  const fetchData = async () => {
    try {
      const res = await fetch(url, {
        headers: { "Content-type": "application/json" },
      });
      const json = await res.json();
      state.response = json;
    } catch (errors) {
      state.error = errors;
    } finally {
      state.fetching = false;
    }
  };

  fetchData();

  return { ...toRefs(state) };
}
