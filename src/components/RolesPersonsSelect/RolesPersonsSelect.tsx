import { FC, useCallback, useMemo } from "react";
import Select from "../BasicSelect/Select";
import { ChangeAction, Group, Option } from "../BasicSelect/Select";
import { Person } from "../Person/Person";

export type Resource = {
  id: number;
  role: string;
  fullName: string;
  email: string;
  teamLeadId: number | null;
  province: string;
  logo: string;
};

interface IResourcesOptions {
  label: string;
  value: string;
  logoSrc: string;
  role: string;
}

interface IRoleOptions {
  value: string;
  label: string;
}

interface IResourcesByRole {
  [x: string]: Resource[];
}

interface ISelectedRolesOptions {
  halfSelected: boolean;
  value: string;
  label: string;
  groupKey?: string | undefined;
}

type RoleOption = Option & { halfSelected?: boolean };
type PersonOption = Option & { logoSrc?: string; role?: string };
type OptionProps = {
  value: PersonOption;
  groupKey?: string;
};
interface IProps {
  resources: Resource[];
  selectedResources: Resource[];
  onChange: (newResources: Resource[]) => void;
}

export const RolesPersonsSelect: FC<IProps> = ({
  resources,
  selectedResources,
  onChange,
}) => {
  const roles: string[] = useMemo(
    () => [
      ...new Set<string>(
        resources?.map((item: Resource) => item.role)
      ).values(),
    ],
    [resources]
  );

  const resourcesByRole: IResourcesByRole = useMemo(() => {
    return roles.reduce((acc: Record<string, Resource[]>, item: string) => {
      const newAcc = { ...acc };
      newAcc[item] = resources.filter(
        (resource: Resource) => resource.role === item
      );
      return newAcc;
    }, {});
  }, [roles, resources]);

  const roleOptions: IRoleOptions[] = useMemo(
    () =>
      roles.map((item: string) => ({
        value: item,
        label: item,
      })),
    [roles]
  );

  const resourcesOptions: IResourcesOptions[] = useMemo(
    () =>
      resources?.map(
        (item: Resource) =>
          ({
            label: item.fullName,
            value: item.id.toString(),
            logoSrc: item.logo,
            role: item.role,
          }) || []
      ),
    [resources]
  );

  const rolesResourcesOptions: Group<Option>[] = useMemo(() => {
    return [
      {
        label: "Roles",
        key: "role",
        options: roleOptions,
      },
      {
        label: "Persons",
        key: "persons",
        options: resourcesOptions,
      },
    ];
  }, [roleOptions, resourcesOptions]);

  const selectedResourcesOptions: IResourcesOptions[] = useMemo(
    () =>
      resourcesOptions.filter((item: PersonOption) =>
        selectedResources.find(
          (selectedResource: Resource) =>
            selectedResource.id.toString() === item.value
        )
      ),
    [selectedResources, resourcesOptions]
  );

  const selectedRolesOptions: ISelectedRolesOptions[] = useMemo(
    () =>
      roleOptions
        .filter((item: Option) =>
          selectedResources.find(
            (selectedResource: Resource) =>
              resourcesByRole[item.value]?.find(
                (roleResource: Resource) =>
                  roleResource.id === selectedResource.id
              )
          )
        )
        .map((item: Option) => ({
          ...item,
          halfSelected:
            !resourcesByRole[item.value]?.every((resource: Resource) =>
              selectedResources.find(
                (selectedResource: Resource) =>
                  selectedResource.id === resource.id
              )
            ) || false,
        })),
    [resourcesByRole, selectedResources, roleOptions]
  );

  const handleChange = useCallback(
    (
      value: PersonOption | PersonOption[] | null,
      { action, option }: ChangeAction<PersonOption>
    ) => {
      if (option?.value === "all") {
        if (selectedResources.length === resources.length) return onChange([]);
        return onChange(resources);
      }

      const changedRole = roleOptions.find(
        (item: Option) => item.value === option?.value
      );

      if (changedRole) {
        const roleResources = resourcesByRole[changedRole.value];
        if (action === "select-option") {
          const newRoleResources =
            roleResources?.filter(
              (item: Resource) =>
                !selectedResources.find(
                  (selectedResource: Resource) =>
                    item.id === selectedResource.id
                )
            ) || [];

          return onChange([...selectedResources, ...newRoleResources]);
        } else {
          const newResources = selectedResources.filter(
            (item: Resource) =>
              !roleResources?.find(
                (roleResource: Resource) => item.id === roleResource.id
              )
          );

          return onChange(newResources);
        }
      }

      return onChange(
        resources.filter((item: Resource) =>
          (value as PersonOption[]).find(
            (selectedOption: PersonOption) =>
              item.id.toString() === selectedOption.value
          )
        )
      );
    },
    [onChange, resources, resourcesByRole, roleOptions, selectedResources]
  );

  const getLabel = (): string => {
    let label = `${selectedResources.length} Persons`;

    const fullSelectedRoles = selectedRolesOptions.filter(
      (item: Option) => !item.halfSelected
    );

    if (fullSelectedRoles.length) {
      label += `, ${fullSelectedRoles.length} Roles`;
    }

    return label;
  };

  return (
    <Select<PersonOption & RoleOption>
      options={rolesResourcesOptions}
      placeholder="Role & Persons"
      isMultiple
      value={[...selectedResourcesOptions, ...selectedRolesOptions]}
      onChange={handleChange}
      Option={CustomOption}
      getLabel={getLabel}
    />
  );
};

const CustomOption = ({ value: optionValue, groupKey }: OptionProps) => {
  if (optionValue.value === "all") return <span>{optionValue.label}</span>;

  return groupKey === "persons" ? (
    <Person
      name={optionValue.label}
      logo={optionValue.logoSrc || ""}
      role={optionValue.role || ""}
    />
  ) : (
    <div>{optionValue.label}</div>
  );
};
