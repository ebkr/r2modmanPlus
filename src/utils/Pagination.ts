
export type PaginationButton = {
    index: number;
    title: string;
}

export function truncatePagination(props: {
    currentPage: number,
    pageCount: number,
    contextSize: number,
}): PaginationButton[] {
    const result = [];

    if (props.currentPage - props.contextSize > 1) {
        result.push({
            index: 1,
            title: "1"
        });
    }
    if (props.currentPage - props.contextSize - 1 > 1) {
        result.push({
            index: props.currentPage - props.contextSize - 1,
            title: "...",
        });
    }

    for (
        let i = props.currentPage - props.contextSize;
        i <= props.currentPage + props.contextSize;
        i++
    ) {
        if (i > 0 && i <= props.pageCount) {
            result.push({
                index: i,
                title: i.toString(),
            });
        }
    }

    if (props.currentPage + props.contextSize + 1 < props.pageCount) {
        result.push({
            index: props.currentPage + props.contextSize + 1,
            title: "...",
        });
    }
    if (props.currentPage + props.contextSize < props.pageCount) {
        result.push({
            index: props.pageCount,
            title: props.pageCount.toString(),
        });
    }

    return result;
}
