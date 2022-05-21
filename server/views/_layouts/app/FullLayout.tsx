import { ReactNode } from "react"
import { BaseLayout } from "./_BaseLayout"

interface IProps {
    children: ReactNode;
}

export const FullLayout: React.FC<IProps> = ({children}) => {
    return (
        <BaseLayout>{children}</BaseLayout>
    )
}