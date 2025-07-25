export default function Section({ title, editable, children }: any) {
    return (
        <section className="mb-6 border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{title}</h2>
                {editable && <span className="text-sm text-blue-500">Editable</span>}
            </div>
            <div>{children}</div>
        </section>
    );
}
