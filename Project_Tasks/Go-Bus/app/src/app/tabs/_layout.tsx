import { NativeTabs } from "expo-router/native-tabs";
export default function TabLayout() {
  return (
    <NativeTabs
      tintColor="#ffd33d"
      backgroundColor="#25292e"
      indicatorColor="rgba(255, 211, 61, 0.2)"
      rippleColor="rgba(255, 211, 61, 0.3)"
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md="home"
        />
      </NativeTabs.Trigger>

      {/* <NativeTabs.Trigger name="movies">
        <NativeTabs.Trigger.Label>Movies</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "video", selected: "video.fill" }}
          md="video_library"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="actors">
        <NativeTabs.Trigger.Label>Actors</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "person", selected: "person.fill" }}
          md="people"
        />
      </NativeTabs.Trigger> */}
    </NativeTabs>
  );
}
