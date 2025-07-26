export default function Section({ title, children }: any) {
    return (
        <section className="mb-6 border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{title}</h2>
            </div>
            <div>{children}</div>
        </section>
    );
}
