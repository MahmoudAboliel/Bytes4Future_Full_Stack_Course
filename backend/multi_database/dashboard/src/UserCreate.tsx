import { Create, SimpleForm, TextInput } from "react-admin";

export const UserCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="family" />
      <TextInput source="age" />
    </SimpleForm>
  </Create>
);
