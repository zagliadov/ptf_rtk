import { FC, useCallback, useMemo } from "react";
import Select from "../BasicSelect/Select";
import { ChangeAction, Group, Option } from "../BasicSelect/Select";
import { Person } from "../Person/Person";
import * as _ from "lodash";

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
  // An array of unique role strings.
  const roles: string[] = useMemo(
    () => _.uniq(_.map(resources, (item: Resource) => item.role)),
    [resources]
  );

  // Computes a mapping of resources by their roles.
  // An object where each key is a role and the value is an array of resources with that role.
  const resourcesByRole: IResourcesByRole = useMemo(() => {
    return _.reduce(
      roles,
      (acc: Record<string, Resource[]>, role: string) => {
        acc[role] = _.filter(resources, { role: role });
        return acc;
      },
      {}
    );
  }, [roles, resources]);

  // An array of objects where each object represents a role option with `value` and `label` properties.
  const roleOptions: IRoleOptions[] = useMemo(
    () => _.map(roles, (role: string) => ({ value: role, label: role })),
    [roles]
  );

  // Creates an array of resource options for use in a select component.
  const resourcesOptions: IResourcesOptions[] = useMemo(
    () =>
      _.map(resources, (resource: Resource) => ({
        label: resource.fullName,
        value: resource.id.toString(),
        logoSrc: resource.logo,
        role: resource.role,
      })),
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

  // An array of resource options that are currently selected.
  const selectedResourcesOptions: IResourcesOptions[] = useMemo(
    () =>
      _.filter<IResourcesOptions>(resourcesOptions, (option: PersonOption) =>
        _.some(
          selectedResources,
          (selectedResource: Resource) =>
            selectedResource.id.toString() === option.value
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
      const changedRole = _.find(roleOptions, { value: option?.value });

      if (changedRole) {
        const roleResources = resourcesByRole[changedRole.value];
        if (action === "select-option") {
          const newRoleResources =
            _.differenceBy(roleResources, selectedResources, "id") || [];
          return onChange([...selectedResources, ...newRoleResources]);
        } else {
          const newResources = _.differenceBy(
            selectedResources,
            roleResources,
            "id"
          );

          return onChange(newResources);
        }
      }

      return onChange(
        _.filter(resources, (item: Resource) =>
          _.some(
            value as PersonOption[],
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
    const fullSelectedRoles = _.filter(selectedRolesOptions, (item: Option) => !item.halfSelected);

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
