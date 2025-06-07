import React from 'react';
import styles from './SkirmishTableBase.module.scss';

export interface SkirmishTableBaseProps<T> {
    skirmishes: T[];
    columns: Array<{ key: string; label: React.ReactNode }>;
    renderRow: (
        skirmish: T,
        expanded: boolean,
        toggleExpand: () => void
    ) => React.ReactNode;
    renderExpanded?: (skirmish: T) => React.ReactNode;
    getRowKey: (skirmish: T) => string;
}

export function SkirmishTableBase<T>({
    skirmishes,
    columns,
    renderRow,
    renderExpanded,
    getRowKey,
}: SkirmishTableBaseProps<T>) {
    const [expandedRows, setExpandedRows] = React.useState<{
        [id: string]: boolean;
    }>({});

    return (
        <table className={styles['skirmish-table']}>
            <thead>
                <tr>
                    <th></th>
                    {columns.map((col) => (
                        <th key={col.key}>{col.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {skirmishes.map((sk) => {
                    const key = getRowKey(sk);
                    const expanded = expandedRows[key] || false;
                    return (
                        <React.Fragment key={key}>
                            {renderRow(sk, expanded, () =>
                                setExpandedRows((rows) => ({
                                    ...rows,
                                    [key]: !rows[key],
                                }))
                            )}
                            {expanded && renderExpanded && (
                                <tr className={styles['skirmish-table__row']}>
                                    <td
                                        colSpan={columns.length + 1}
                                        className={
                                            styles['skirmish-table__expanded']
                                        }
                                    >
                                        <div
                                            className={
                                                styles[
                                                    'skirmish-table__expanded-actions'
                                                ]
                                            }
                                        >
                                            {renderExpanded(sk)}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    );
                })}
            </tbody>
        </table>
    );
}
