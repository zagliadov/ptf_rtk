const SourceTypes = {
    PROJECT: 'Project',
    SITE: 'Site',
    TRAVEL_REQUEST: 'Travel request',
    TICKET: 'Ticket',
} as const

export type SourceType = typeof SourceTypes[keyof typeof SourceTypes]

export type Source = {
    name: SourceType,
    tableName: string,
    viewName?: string;
}

export const sourceByType: Record<SourceType, Source> = {
    [SourceTypes.PROJECT]: {
        name: SourceTypes.PROJECT,
        tableName: 'Project',
        viewName: 'API Data Warehouse',
    },
    [SourceTypes.SITE]: {
        name: SourceTypes.SITE,
        tableName: 'Site',
        viewName: 'API View',
    },
    [SourceTypes.TRAVEL_REQUEST]: {
        name: SourceTypes.TRAVEL_REQUEST,
        tableName: 'TravelRequest',
        viewName: 'API View',
    },
    [SourceTypes.TICKET]: {
        name: SourceTypes.TICKET,
        tableName: 'Ticket',
        viewName: 'API View',
    },
}